import { v4 as uuidv4 } from 'uuid';
import { FileService } from '../services/FileService';
import { LoggerService } from '../services/LoggerService';
import { formatDate } from './formatDate';

export const fileCreation = async (
	creationDirectory: string,
	totalFilesCount: number,
	groupFilesCount: number,
	creationGroupInterval: number,
) => {
	const fileService = new FileService(creationDirectory);
	const loggerService = new LoggerService(creationDirectory);

	console.log(`[${formatDate(new Date(), true)}] Процесс создания файлов...`);
	const folderName = formatDate(new Date());
	let filesCount = 0;

	await loggerService.appendLog(await fileService.createFolder(folderName));

	await new Promise(res => {
		const interval = setInterval(async () => {
			for (let i = 0; i < groupFilesCount; i++) {
				const result = await fileService.createFile(`${folderName}/${uuidv4()}`, Date.now().toString());
				await loggerService.appendLog(result);
				filesCount++;
			}

			if (filesCount >= totalFilesCount) {
				clearInterval(interval);
				res(undefined);
			}
		}, creationGroupInterval * 1000);
	});

	console.log(
		`[${formatDate(
			new Date(),
			true,
		)}] Создание файлов закончено. Всего файлов ${filesCount}шт, файлов в группе ${groupFilesCount}шт с интервалом ${creationGroupInterval}с`,
	);
};
