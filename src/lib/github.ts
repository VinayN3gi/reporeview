import {Octokit} from "octokit"

export const octokit=new Octokit({
    auth : process.env.GITHUB_TOKEN
})

export type CommitResponse={
    commitMessage : string
    commitHash : string
    commitAuthorName : string 
    commitAuthorAvatar : string
    commitDate : string
}

export const getCommitHashes=async(githubUrl : string) : Promise<CommitResponse[]> =>{
    const [owner,repo]=githubUrl.split('/').slice(-2);
    const {data}=await octokit.rest.repos.listCommits({
        owner : owner!,
        repo : repo!,
    })
    
    const sortedCommits=data.sort((a : any,b : any)=>new Date(b.commit.author.date).getTime()-new Date(a.commit.author.date).getTime()) as any[]

    return sortedCommits.map((commit : any)=>({
        commitMessage : commit.commit.message ?? "",
        commitHash : commit.sha as string,
        commitAuthorName : commit.commit?.author?.name ?? "",
        commitAuthorAvatar : commit.author?.avatar_url ?? "",
        commitDate : commit.commit?.author?.date ?? "",
    }))
}

export const getCommitDiff = async (githubUrl: string, commitHash: string): Promise<string> => {
    const [owner, repo] = githubUrl.split('/').slice(-2);
    const { data } = await octokit.rest.repos.getCommit({
        owner: owner!,
        repo: repo!,
        ref: commitHash,
        mediaType: { format: "diff" },
    });
    // When format is "diff", data is returned as a raw string
    return data as unknown as string;
};




