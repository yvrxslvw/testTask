import { FileService } from './services/FileService';
import { LoggerService } from './services/LoggerService';
import { checkArgs } from './utils/checkArgs';
import { fileComparison } from './utils/fileComparison';
import { fileCreation } from './utils/fileCreation';

const { creationDirectory, totalFilesCount, groupFilesCount, creationGroupInterval, comparisonDirectory, waitingTime } =
	checkArgs(process.argv.slice(2));
const fileService = new FileService(creationDirectory);
const loggerService = new LoggerService(creationDirectory);

(async () => {
	const resultDirectory = await fileCreation(
		fileService,
		loggerService,
		creationDirectory,
		totalFilesCount,
		groupFilesCount,
		creationGroupInterval,
	);
	await fileComparison(fileService, loggerService, resultDirectory, comparisonDirectory, waitingTime);
})();
