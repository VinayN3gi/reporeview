import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf-8');
const apiKey = envFile.split('\n').find(line => line.startsWith('GEMINI_API_KEY=')).split('=')[1].trim();
process.env.GEMINI_API_KEY = apiKey;

async function run() {
    try {
        const ai = new GoogleGenAI({ apiKey });
        console.log("Trying text-embedding-004 without config");
        const response = await ai.models.embedContent({
            model: 'text-embedding-004',
            contents: "Hello world"
        });
        console.log("text-embedding-004 length:", response.embeddings[0].values.length);
    } catch(e) {
        console.error("text-embedding-004 failed:", e.message);
    }
}
run();
