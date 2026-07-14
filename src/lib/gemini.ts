import {GoogleGenerativeAI} from '@google/generative-ai';
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
