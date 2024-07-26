import RepoInfo from './RepoInfo';
import BranchMetrics from './BranchMetrics';

import { IRepoProps } from '../utilities/types';

function RepoMetricsDisplay({ repo }: IRepoProps) {
	return (
		<div>
			<RepoInfo repo={repo} />
			<BranchMetrics repo={repo} />
		</div>
	);

}

export default RepoMetricsDisplay;