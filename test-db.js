import { PrismaClient } from './generated/prisma/index.js';

const prisma = new PrismaClient();

async function run() {
    const embeddings = await prisma.sourceCodeEmbedding.findMany({ take: 1 });
    if (embeddings.length === 0) {
        console.log("No embeddings found in the database.");
    } else {
        const e = embeddings[0];
        console.log(`Found embedding for file: ${e.fileName}`);
        const result = await prisma.$queryRaw`SELECT "summaryEmbedding"::text FROM "SourceCodeEmbedding" WHERE id = ${e.id}`;
        console.log("summaryEmbedding is null?", result[0].summaryEmbedding === null);
        console.log("summaryEmbedding type:", typeof result[0].summaryEmbedding);
        if (result[0].summaryEmbedding) {
            console.log("summaryEmbedding sample:", result[0].summaryEmbedding.substring(0, 100));
        }
    }
    await prisma.$disconnect();
}
run();
