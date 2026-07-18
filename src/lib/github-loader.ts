import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github"
import { summariseCode, generateEmebeddings } from "./gemini"
import type { Document } from '@langchain/core/documents';

export const loadGithubRepo = async(githubUrl : string , githubToken? : string) =>
{
    const [owner, repo] = githubUrl.split('/').slice(-2);
    let defaultBranch = 'main';
    try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
            headers: githubToken ? { Authorization: `Bearer ${githubToken}` } : {},
        });
        if (response.ok) {
            const data = await response.json();
            defaultBranch = data.default_branch;
        }
    } catch (e) {
        console.error("Failed to fetch default branch", e);
    }

    const loader=new GithubRepoLoader(githubUrl,{
        accessToken : githubToken ?? '',
        branch : defaultBranch,
        ignoreFiles : ['package-lock.json','yarn-lock','pnpm-lock.yaml','bun.lockb'],
        recursive : true,
        unknown : 'warn',
        maxConcurrency : 5
    })

    const docs=await loader.load()
    return docs
}


import { db } from "@/server/db";

export const indexGithubRepo=async (projectId : string , githubUrl : string , githubToken? :string)=>{
    const docs=await loadGithubRepo(githubUrl,githubToken)
    const allEmbeddings = await processAndEmbedDocs(docs)
    await Promise.allSettled(allEmbeddings.map(async(embedding, index) => {
        console.log(`processing ${index} of ${allEmbeddings.length}`)
        if (!embedding) return

        const sourceCodeEmbedding = await db.sourceCodeEmbedding.create({
            data: {
                summary: embedding.summary,
                sourceCode: embedding.sourceCode,
                fileName: embedding.fileName,
                projectId,
            }
        })
        
        await db.$executeRaw`
        UPDATE "SourceCodeEmbedding"
        SET "summaryEmbedding" = ${embedding.embedding}::vector
        WHERE "id" = ${sourceCodeEmbedding.id}
        `
    }))
}

export const processAndEmbedDocs = async(docs : Document[]) =>{
    const res = [];
    const BATCH_SIZE = 5;

    for (let i = 0; i < docs.length; i += BATCH_SIZE) {
        const batch = docs.slice(i, i + BATCH_SIZE);
        
        const batchResults = await Promise.all(batch.map(async (doc) => {
            try {
                const summary = await summariseCode(doc);
                if (!summary) return null;

                const embedding = await generateEmebeddings(summary);
                if (!embedding || embedding.length === 0) return null;

                return {
                    summary,
                    embedding,
                    sourceCode : doc.pageContent,
                    fileName: doc.metadata.source as string ?? ""
                };
            } catch (error) {
                console.error(`Failed to process document ${doc.metadata.source}:`, error);
                return null;
            }
        }));

        const validResults = batchResults.filter((r): r is NonNullable<typeof r> => r !== null);
        res.push(...validResults);
    }
    
    return res;
}