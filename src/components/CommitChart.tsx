import { ICommitProp, IWeeklyCommitActivity } from '../utilities/types';
import { Line } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	ScriptableContext
} from 'chart.js';
import '../styles/CommitChart.css'


ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

const options = {
	responsive: true,
	maintainAspectRatio: true,
	plugins: {
		title: {
			display: true,
			text: 'Weekly Commit History',
		},
		legend: {
			display: true,
			labels: {
				color: 'black'
			}
		}
	},

};

function pointSizer(context: ScriptableContext<'line'>, maxVal: number) {
	const value = context.raw as number < 0 ? -(context.raw as number) : context.raw as number;
	if (value < maxVal / 10) return 0;
	return 2;
}

function getMaxValues(commits: IWeeklyCommitActivity[]): [number, number] {
	let maxAdditions = 0;
	let maxDeletions = 0;
	for (let commit of commits) {
		if (commit.additions > maxAdditions) {
			maxAdditions = commit.additions;
		}
		if (commit.deletions < maxDeletions) {
			maxDeletions = commit.deletions;
		}
	}
	return [maxAdditions, maxDeletions];
}


function CommitChart({ commits }: ICommitProp) {
	const [maxAdditions, maxDeletions] = getMaxValues(commits);
	const data = {
		labels: commits.map((c) => new Date(c.timestamp * 1000).toLocaleDateString()),
		datasets: [
			{
				label: 'Additions',
				data: commits.map((c) => c.additions),
				fill: false,
				borderWidth: 1,
				borderColor: 'green',
				pointRadius: (context: ScriptableContext<'line'>) => pointSizer(context, maxAdditions),
				tension: 0.1
			},
			{
				label: 'Deletions',
				data: commits.map((c) => c.deletions),
				fill: false,
				borderWidth: 1,
				borderColor: 'red',
				pointRadius: (context: ScriptableContext<'line'>) => pointSizer(context, -maxDeletions),
				tension: 0.1
			}
		]
	};

	return (
		<div className='graphContainer'>
			{data ? <Line data={data} options={options} /> : ""}
		</div>
	);
}

export default CommitChart;