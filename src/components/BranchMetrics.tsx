import { IRepoProps } from "../utilities/types";
import { useState } from 'react';
import { IBranch } from "../utilities/types";
import { getBranchMetrics } from "../utilities/branchMetrics";
import '../styles/BranchMetrics.css';

function BranchMetrics({ repo }: IRepoProps) {
	const [selectedBranch, setSelectedBranch] = useState<IBranch>(repo.branches[0]);
	const [branches, setBranches] = useState<IBranch[]>(repo.branches);

	async function changeBranch(branch: IBranch) {
		setSelectedBranch(branch);
		if (!branch.metrics) {
			branch.metrics = await getBranchMetrics(repo.name, repo.owner, branch.sha);
			setBranches((brs) =>
				brs.map((br) =>
					br.sha === branch.sha ? { ...br, metrics: branch.metrics } : br
				)
			);
		}
	}

	return (
		<div id='branchesWrapper'>
			<ul id='branchesContainer'>
				{branches.map((branch) =>
					<li key={branch.sha}
						onClick={() => changeBranch(branch)}
						className={`branchName ${selectedBranch === branch ? 'selected' : 'unselected'}`}>
						{branch.name}
					</li>)}
			</ul>
			{selectedBranch.metrics ?
				<div>
					This branch has {selectedBranch.metrics.linesOfCode} lines of code!
				</div>
				:
				<div>
					Metrics are loading...
				</div>}

		</div>
	);
}

export default BranchMetrics;
