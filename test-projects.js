import { PrismaClient } from './generated/prisma/index.js';

const prisma = new PrismaClient();

async function run() {
    const projects = await prisma.project.findMany({
        include: { _count: { select: { sourceCodeEmbeddings: true } } }
    });
    console.log("Projects:");
    for (const p of projects) {
        console.log(`- ${p.name} (id: ${p.id}): ${p._count.sourceCodeEmbeddings} files`);
    }
    await prisma.$disconnect();
}
run();
