import { IRepo, IRepoProps } from "../utilities/types";

import CommitChart from "./CommitChart";

import '../styles/RepoInfo.css'

export function RepoInfo({ repo }: IRepoProps) {
	return (
		<div className='mainContainer'>
			<p className='detailsText repoName'>{repo.name}</p>
			<div className='infoContainer'>
				<div className='labelAndDetailsContainer'>
					<p className='detailsText detailsLabel'>Owner</p>
					<p className='detailsText repoOwner'>{repo.owner}</p>
				</div>
				<div className='labelAndDetailsContainer'>
					<p className='detailsText detailsLabel'>Contributors</p>
					<ul className='contributorsList'>
						{repo.repoDetails.contributors.slice(0, 3).map((contributor) =>
							<li className='detailsText contributor' key={contributor.username}>
								<a href={contributor.url}>
									{contributor.username}</a>

							</li>)}
					</ul>
				</div>
			</div>
			<CommitChart commits={repo.repoDetails.weeklyCommitActivity} />
		</div>
	);

}

export default RepoInfo;