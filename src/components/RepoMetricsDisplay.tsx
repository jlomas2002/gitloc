import { IRepoProps } from '../utilities/types';

import RepoInfo from './RepoInfo';
import BranchMetrics from './BranchMetrics';

function RepoMetricsDisplay({ repo }: IRepoProps) {
	return (
		<div>
			<RepoInfo repo={repo} />
			<BranchMetrics repo={repo} />
		</div>
	);

}

export default RepoMetricsDisplay;