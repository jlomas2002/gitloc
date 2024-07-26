import { sleep } from "./utils";
import { octokit } from "./types";
import { IContributor, IWeeklyCommitActivity, IRepoDetails } from "./types";

// Page views (Requires write access)
//await getPageViews(owner, repoName);

export async function getRepoInfo(repoName: string, owner: string): Promise<IRepoDetails> {
	const details = {} as IRepoDetails;

	details.contributors = await getContributors(repoName, owner);
	details.weeklyCommitActivity = await getWeeklyCommitActivity(repoName, owner);

	return details;
}

async function getWeeklyCommitActivity(repoName: string, owner: string): Promise<IWeeklyCommitActivity[]> {
	let response;
	do {
		response = await octokit.request('GET /repos/{owner}/{repo}/stats/code_frequency', {
			owner: owner,
			repo: repoName,
			headers: {
				'X-GitHub-Api-Version': '2022-11-28'
			}
		});

		if (response.status === 200) {
			break;
		}
		await sleep(10000);
	} while (true);

	const weeklyCommitActivity: IWeeklyCommitActivity[] = [];
	for (let activityData of response.data) {
		const commitActivity = {} as IWeeklyCommitActivity;
		commitActivity.timestamp = activityData[0];
		commitActivity.additions = activityData[1];
		commitActivity.deletions = activityData[2];
		weeklyCommitActivity.push(commitActivity);
	}

	return weeklyCommitActivity;
}

async function getContributors(repoName: string, owner: string): Promise<IContributor[]> {
	const response = await octokit.request('GET /repos/{owner}/{repo}/contributors', {
		owner: owner,
		repo: repoName,
		headers: {
			'X-GitHub-Api-Version': '2022-11-28'
		}
	});

	const contributors: IContributor[] = [];

	for (let data of response.data) {
		const contributor = {} as IContributor;
		contributor.username = data.login ? data.login : "";
		contributor.url = data.html_url ? data.html_url : "";
		contributors.push(contributor);
	}

	return contributors;
}

async function getPageViews(repoName: string, owner: string) {
	const response = await octokit.request('GET /repos/{owner}/{repo}/traffic/views', {
		owner: owner,
		repo: repoName,
		headers: {
			'X-GitHub-Api-Version': '2022-11-28'
		}
	});

	console.log("Page view response", response);
}
