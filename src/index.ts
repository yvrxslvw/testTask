import { checkArgs } from './utils/checkArgs';

// yarn dev --creation-directory=./dist/output --total-files-count=10 --group-files-count=2 --creation-group-interval=5 --comparison-directory=./dist/output/B --waiting-time=30

const { creationDirectory, totalFilesCount, groupFilesCount, creationGroupInterval, comparisonDirectory, waitingTime } =
	checkArgs(process.argv.slice(2));
