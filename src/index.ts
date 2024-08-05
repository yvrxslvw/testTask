import { checkArgs } from './utils/checkArgs';

const { mode, totalFilesCount, groupFilesCount, creationGroupInterval } = checkArgs(process.argv.slice(2));

console.log(mode, totalFilesCount, groupFilesCount, creationGroupInterval);
