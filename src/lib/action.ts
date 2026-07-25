"use server"

import { db } from "@/server/db";
import { generateEmebeddings } from "./gemini";
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
    model: 'gemini-3.1-flash-lite' // Reverting back to supported model
});

export async function askQuestion(question: string, projectId: string) {
    try {
        // 1. Generate embedding for the user's question
        const queryVector = await generateEmebeddings(question);

        if (!queryVector || queryVector.length === 0) {
            throw new Error("Failed to generate embedding for the question.");
        }

        // 2. Query the vector database for the top 5 most relevant source files
        // We cast the array to text and format it as a pgvector string: '[val1, val2, ...]'
        const vectorStr = `[${queryVector.join(',')}]`;
        
        const result = await db.$queryRaw`
            SELECT "fileName", "summary", "sourceCode",
            1 - ("summaryEmbedding" <=> ${vectorStr}::vector) as similarity
            FROM "SourceCodeEmbedding"
            WHERE "projectId" = ${projectId}
            ORDER BY similarity DESC
            LIMIT 5;
        ` as { fileName: string, summary: string, sourceCode: string, similarity: number }[];

        const relevantResults = result.filter(r => r.similarity >= 0.7);

        if (!relevantResults || relevantResults.length === 0) {
            return "I couldn't find any relevant code in this repository to answer your question. Make sure the repository has been indexed.";
        }

        // 3. Construct context from retrieved documents
        let context = "";
        for (const file of relevantResults) {
            context += `--- File: ${file.fileName} ---\nSummary: ${file.summary}\nCode:\n${file.sourceCode}\n\n`;
        }

        // 4. Generate answer using Gemini
        const prompt = `You are a helpful and expert AI coding assistant answering questions about a specific codebase.
Use the following context retrieved from the codebase to answer the user's question. 
If the context doesn't contain the answer, say you don't have enough information from the current context but try to be as helpful as possible.

Context from the codebase:
${context}

Question: ${question}

Provide a detailed, helpful, and highly accurate technical answer. Use markdown for formatting code blocks.`;

        const response = await model.generateContent([prompt]);
        return response.response.text();
    } catch (error) {
        console.error("Error in askQuestion RAG:", error);
        return "Sorry, I encountered an error while trying to answer your question.";
    }
}