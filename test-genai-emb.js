import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf-8');
const apiKey = envFile.split('\n').find(line => line.startsWith('GEMINI_API_KEY=')).split('=')[1].trim();

process.env.GEMINI_API_KEY = apiKey;

async function run() {
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        console.log("Trying text-embedding-004 with GoogleGenerativeAI");
        const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
        const result = await model.embedContent("Hello world");
        console.log("text-embedding-004 length:", result.embedding.values.length);
    } catch(e) {
        console.error("text-embedding-004 failed:", e.message);
    }
}
run();
