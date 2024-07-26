import { IBranchMetrics, IContributor, IWeeklyCommitActivity } from "./types";
import { octokit } from "./types";
import { OctokitResponse } from "@octokit/types";
import { isCodeFile } from "./utils";

export async function getBranchMetrics(repoName: string, owner: string, sha: string,): Promise<IBranchMetrics> {
	const metrics = {} as IBranchMetrics;
	const branchTree = await getBranchTree(repoName, owner, sha);

	// Lines of code
	const fileContents = await getFileContents(repoName, owner, branchTree.data.tree);
	let totalNumOfLines = 0;
	for (const file of fileContents) {
		totalNumOfLines += calculateNumOfLines(file);
	}
	metrics.linesOfCode = totalNumOfLines;

	// cyclomatic complexity
	// num lines of comments

	return metrics;
}

async function getBranchTree(repoName: string, owner: string, sha: string): Promise<OctokitResponse<{
	sha: string;
	url: string;
	truncated: boolean;
	tree: {
		path?: string;
		mode?: string;
		type?: string;
		sha?: string;
		size?: number;
		url?: string;
	}[];
}, 200>> {
	return await octokit.request('GET /repos/{owner}/{repo}/git/trees/{tree_sha}', {
		owner: owner,
		repo: repoName,
		tree_sha: sha,
		recursive: '1',
		headers: {
			'X-GitHub-Api-Version': '2022-11-28',
			'accept': 'application/vnd.github+json'
		}
	});
}

async function getFileContents(repoName: string, owner: string, tree: {
	path?: string;
	mode?: string;
	type?: string;
	sha?: string;
	size?: number;
	url?: string;
}[]): Promise<string[]> {

	const contents: string[] = [];

	for (const fileInfo of tree) {
		if (fileInfo.path && isCodeFile(fileInfo.path) && fileInfo.sha && fileInfo.type == "blob") {
			const response = await octokit.request('GET /repos/{owner}/{repo}/git/blobs/{file_sha}', {
				owner: owner,
				repo: repoName,
				file_sha: fileInfo.sha,
				headers: {
					'X-GitHub-Api-Version': '2022-11-28'
				}
			});

			contents.push(atob(response.data.content));
		}
	}

	return contents;
}

function calculateNumOfLines(fileData: string): number {
	let lines = 1;
	for (const char of fileData) {
		if (char == '\n') {
			lines++;
		}
	}
	return lines;
}
