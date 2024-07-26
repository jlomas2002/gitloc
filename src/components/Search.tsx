import React from 'react';
import { useState } from 'react';

import { IRepo, IBranch, octokit } from '../utilities/types';
import { getBranchMetrics } from '../utilities/branchMetrics';
import { getRepoInfo } from '../utilities/repoInfo';
import { isRepoLink } from '../utilities/utils';

import Loading from './Loading';
import NoSearchYet from './NoSearchYet';
import RepoMetricsDisplay from './RepoMetricsDisplay';
import InvalidRepo from './InvalidRepo';

import '../styles/Search.css';

const MaxNumBranchesToLoad = 1;

function Search() {
	const [repoLink, setRepoLink] = useState("");
	const [repo, setRepo] = useState<IRepo | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [invalidRepoLink, setInvalidRepoLink] = useState(false);

	async function runRepoSearch(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setIsLoading(true);
		setRepo(null);
		setInvalidRepoLink(false);

		if (!isRepoLink(repoLink)) {
			setInvalidRepoLink(true);
			setIsLoading(false);
			return;
		}

		const repoData = {} as IRepo;
		[, , , repoData.owner, repoData.name] = repoLink.split('/');

		// Get general repo info
		repoData.repoDetails = await getRepoInfo(repoData.name, repoData.owner);

		// Get the branch names and sha hashes
		const branchResponse = await octokit.request('GET /repos/{owner}/{repo}/branches', {
			owner: repoData.owner,
			repo: repoData.name,
			headers: {
				'X-GitHub-Api-Version': '2022-11-28',
				'accept': 'application/vnd.github+json'
			}
		});

		repoData.branches = branchResponse.data.map(br => ({ name: br.name, sha: br.commit.sha } as IBranch));
		let numBranchesToLoad = repoData.branches.length < MaxNumBranchesToLoad ? repoData.branches.length : MaxNumBranchesToLoad;

		// Get metrics of first n branches
		for (let i = 0; i < numBranchesToLoad; i++) {
			repoData.branches[i].metrics = await getBranchMetrics(repoData.name, repoData.owner, repoData.branches[i].sha);
		}


		setRepo(repoData);
		setIsLoading(false);
	}

	return (
		<div>
			<form className="searchContainer" onSubmit={runRepoSearch}>
				<input type="search" className='searchInput' name="repoSearch" placeholder="e.g https://github.com/jlomas2002/gitloc"
					value={repoLink} onChange={(e) => setRepoLink(e.target.value)} />
				<input className="searchSubmit" type="submit" value="Go" />
			</form>
			{isLoading ? <Loading /> :
				repo && repo.branches.length > 0 ? <RepoMetricsDisplay repo={repo} /> :
					invalidRepoLink ? <InvalidRepo /> : <NoSearchYet />
			}
		</div>

	);
}


export default Search;
