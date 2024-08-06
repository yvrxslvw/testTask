import { FileService } from './services/FileService';
import { LoggerService } from './services/LoggerService';
import { checkArgs } from './utils/checkArgs';
import { fileComparison } from './utils/fileComparison';
import { fileCreation } from './utils/fileCreation';

// yarn dev --creation-directory=./dist/output --total-files-count=10 --group-files-count=2 --creation-group-interval=1 --comparison-directory=./dist/output/B --waiting-time=30

const { creationDirectory, totalFilesCount, groupFilesCount, creationGroupInterval, comparisonDirectory, waitingTime } =
	checkArgs(process.argv.slice(2));
const fileService = new FileService(creationDirectory);
const loggerService = new LoggerService(creationDirectory);

(async () => {
	const resultDirectory = await fileCreation(fileService, loggerService, creationDirectory, totalFilesCount, groupFilesCount, creationGroupInterval);
	await fileComparison(fileService, loggerService, resultDirectory, comparisonDirectory, waitingTime);
})();
