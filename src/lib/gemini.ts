import {GoogleGenerativeAI} from '@google/generative-ai';
import type { Document } from '@langchain/core/documents';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
    model: 'gemini-3.1-flash-lite'
});

export const summarizeCommit = async (diff: string): Promise<string> => {
    const response = await model.generateContent([
        `You are an expert programmer, and you are trying to summarize a git diff.
Reminders about the git diff format:
For every file, there are a few metadata lines, like (for example):
\`\`\`
diff --git a/lib/index.js b/lib/index.js
index aadf691..bfef603 100644
--- a/lib/index.js
+++ b/lib/index.js
\`\`\`
This means that \`lib/index.js\` was modified in this commit. Note that this is only an example.
Then there is a specifier of the lines that were modified.
A line starting with \`+\` means it was added.
A line starting with \`-\` means it was removed.
A line that starts with neither \`+\` nor \`-\` is code given for context and better understanding.
It is not part of the diff.
[...]
EXAMPLE SUMMARY COMMENTS:
\`\`\`
* Raised the amount of returned recordings from \`10\` to \`100\` [packages/server/recordings_api.ts], [## packages/server/constants.ts]
* Fixed a typo in the github action name [.github/workflows/gedelta.yml]
* Moved the \`hierarchyTest\` function to the \`src/tests\` folder [src/tests/hierarchyTest.ts]
* Added a new optional parameter \`por498depth\` to the \`getFloor498\` function [src/getFloor498.ts]
* Deleted the \`hierarchyTest\` test suite [test/hierarchyTest.ts]
* Refactored the \`calculateVolume\` function to use early returns [src/calculateVolume.ts]
\`\`\`
Most commits will have less comments than this example list.
The last comment does not include the file names,
because there were more than two relevant files in the hypothetical commit.
Do not include parts of the example in your summary.
It is given only as an example of appropriate comments.`,
        `Please summarize the following git diff:\n\n${diff}`,
    ]);

    return response.response.text();
};


const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function summariseCode(doc: Document) {
    console.log("Summarizing code for:", doc.metadata.source);
    try {
        const code = doc.pageContent.slice(0, 10000); // limit to avoid token exhaustion on extremely large files
        let retries = 0;
        while (retries < 3) {
            try {
                const response = await model.generateContent([
                    `You are an expert software engineer and technical writer. Your task is to generate a structured, onboarding-friendly summary of the provided source code file.
New developers will read this summary to quickly understand the codebase.

File Path: ${doc.metadata.source ?? 'unknown'}

Here is the source code:
\`\`\`
${code}
\`\`\`

Provide a clear and concise summary covering:
1. The file's main purpose.
2. Key exports / functions.
3. Critical onboarding notes.

CRITICAL REQUIREMENT: The entire summary must be extremely concise and strictly limited to 100 words or less. Do not exceed this limit under any circumstances.`,
                ]);

                return response.response.text();
            } catch (e: any) {
                if (e.status === 429 && retries < 2) {
                    console.log(`Rate limit hit for ${doc.metadata.source}, retrying in 2 seconds... (${retries + 1}/3)`);
                    await delay(2000);
                    retries++;
                } else {
                    throw e;
                }
            }
        }
        return "";
    } catch (error) {
        console.error("Error summarizing code in summariseCode:", error);
        return "";
    }
}


import { GoogleGenAI } from '@google/genai';

export async function generateEmebeddings(summary: string): Promise<number[]> {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const response = await ai.models.embedContent({
            model: 'gemini-embedding-001',
            contents: summary,
            config: { outputDimensionality: 768 },
        });
        const embeddings = response.embeddings;
        if (!embeddings || embeddings.length === 0) return [];
        return embeddings[0]?.values ?? [];
    } catch (error) {
        console.error("Error in generateEmebeddings:", error);
        return [];
    }
}
