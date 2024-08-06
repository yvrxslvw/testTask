import { checkArgs } from './utils/checkArgs';

const { totalFilesCount, groupFilesCount, creationGroupInterval, comparisonDirectory, waitingTime } = checkArgs(
	process.argv.slice(2),
);

console.log(totalFilesCount, groupFilesCount, creationGroupInterval, comparisonDirectory, waitingTime);
