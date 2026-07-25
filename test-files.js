import { PrismaClient } from './generated/prisma/index.js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function run() {
    const allFiles = await prisma.sourceCodeEmbedding.findMany({
        select: { fileName: true }
    });
    console.log("Total files indexed:", allFiles.length);
    console.log("Some files:");
    console.log(allFiles.slice(0, 10).map(f => f.fileName));

    const geminiFile = await prisma.sourceCodeEmbedding.findFirst({
        where: { fileName: { contains: 'gemini.ts' } }
    });
    if (geminiFile) {
        console.log("Found gemini.ts in DB!");
    } else {
        console.log("gemini.ts is NOT in DB.");
    }

    await prisma.$disconnect();
}
run();
