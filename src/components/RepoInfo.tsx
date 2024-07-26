import { IRepo, IRepoProps } from "../utilities/types";
import CommitChart from "./CommitChart";
import '../styles/RepoInfo.css'

export function RepoInfo({ repo }: IRepoProps) {
	return (
		<div className='mainContainer'>
			<div className="detailsContainer">
				<p className='detailsText repoName'>{repo.name}</p>
				<div className='labelAndDetail'>
					<p className='detailsText detailsLabel'>Owner</p>
					<p className='detailsText repoOwner'>{repo.owner}</p>
				</div>
				<div className='labelAndDetail'>
					<p className='detailsText detailsLabel'>Contributors</p>
					<ul className='contributorsList'>
						{repo.repoDetails.contributors.slice(0, 3).map((contributor) =>
							<li key={contributor.username}>
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