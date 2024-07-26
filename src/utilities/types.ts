import { Octokit } from "@octokit/rest";

export interface IRepoProps {
	repo: IRepo;
}

export interface IRepo {
	name: string;
	owner: string;
	repoDetails: IRepoDetails;
	branches: IBranch[];
}

export interface ICommitProp {
	commits: IWeeklyCommitActivity[];
}

export interface IRepoDetails {
	lastModified: Date;
	contributors: IContributor[];
	weeklyCommitActivity: IWeeklyCommitActivity[];
}

export interface IBranch {
	name: string;
	sha: string;
	metrics: IBranchMetrics;
}

export interface IBranchMetrics {
	linesOfCode: number;
}

export interface IContributor {
	username: string;
	url: string;
}

export interface IWeeklyCommitActivity {
	timestamp: number;
	additions: number;
	deletions: number;
}

// Where to put?
export const octokit = new Octokit({
	auth: process.env.REACT_APP_OCTOKIT_KEY
})
