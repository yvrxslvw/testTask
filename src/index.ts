import { checkArgs } from './utils/checkArgs';
import { fileCreation } from './utils/fileCreation';

// yarn dev --creation-directory=./dist/output --total-files-count=10 --group-files-count=2 --creation-group-interval=1 --comparison-directory=./dist/output/B --waiting-time=30

const { creationDirectory, totalFilesCount, groupFilesCount, creationGroupInterval, comparisonDirectory, waitingTime } =
	checkArgs(process.argv.slice(2));

(async () => {
	await fileCreation(creationDirectory, totalFilesCount, groupFilesCount, creationGroupInterval);
})();
