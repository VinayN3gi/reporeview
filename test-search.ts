import { PrismaClient } from './generated/prisma/index.js';
import { generateEmebeddings } from './src/lib/gemini.ts';
import fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf-8');
const apiKey = envFile.split('\n').find(line => line.startsWith('GEMINI_API_KEY=')).split('=')[1].trim();

process.env.GEMINI_API_KEY = apiKey;

const prisma = new PrismaClient();

async function run() {
    try {
        const embeddings = await prisma.sourceCodeEmbedding.findMany({ take: 1 });
        if (embeddings.length === 0) {
            console.log("No embeddings found.");
            return;
        }
        const projectId = embeddings[0].projectId;
        console.log("Using projectId:", projectId);

        const question = "How do we generate embeddings?";
        console.log("Question:", question);
        
        const queryVector = await generateEmebeddings(question);
        if (!queryVector || queryVector.length === 0) {
            console.log("Failed to generate embedding for question");
            return;
        }
        
        const vectorStr = `[${queryVector.join(',')}]`;
        
        const result = await prisma.$queryRaw`
            SELECT "fileName",
            1 - ("summaryEmbedding" <=> ${vectorStr}::vector) as similarity
            FROM "SourceCodeEmbedding"
            WHERE "projectId" = ${projectId}
            ORDER BY similarity DESC
            LIMIT 5;
        `;
        
        console.log("Query Results:");
        console.log(result);

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
run();
