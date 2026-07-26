// @ts-nocheck
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf-8');
const apiKey = envFile.split('\n').find(line => line.startsWith('GEMINI_API_KEY=')).split('=')[1].trim();

process.env.GEMINI_API_KEY = apiKey;

async function run() {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        console.log("Trying gemini-embedding-001");
        const response1 = await ai.models.embedContent({
            model: 'gemini-embedding-001',
            contents: "Hello world",
            config: { outputDimensionality: 768 },
        });
        console.log("gemini-embedding-001 length:", response1.embeddings[0].values.length);
    } catch(e) {
        console.error("gemini-embedding-001 failed:", e.message);
    }

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        console.log("Trying text-embedding-004");
        const response2 = await ai.models.embedContent({
            model: 'text-embedding-004',
            contents: "Hello world",
            config: { outputDimensionality: 768 },
        });
        console.log("text-embedding-004 length:", response2.embeddings[0].values.length);
    } catch(e) {
        console.error("text-embedding-004 failed:", e.message);
    }
}
run();
