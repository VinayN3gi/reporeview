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
        if (embeddings.length === 0) return;
        const e = embeddings[0];
        
        console.log("Original File:", e.fileName);
        console.log("Original Summary:", e.summary);

        const queryVector = await generateEmebeddings(e.summary);
        const vectorStr = `[${queryVector.join(',')}]`;
        
        const result = await prisma.$queryRaw`
            SELECT "fileName",
            1 - ("summaryEmbedding" <=> ${vectorStr}::vector) as similarity
            FROM "SourceCodeEmbedding"
            WHERE "projectId" = ${e.projectId}
            ORDER BY similarity DESC
            LIMIT 5;
        `;
        
        console.log("Query Results for EXACT summary:");
        console.log(result);
    } finally {
        await prisma.$disconnect();
    }
}
run();
