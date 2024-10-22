import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { FileService } from '../services/FileService';
import { LoggerService } from '../services/LoggerService';
import { formatDate } from './formatDate';
import { randomString } from './randomString';

export const fileCreation = async (
	fileService: FileService,
	loggerService: LoggerService,
	creationDirectory: string,
	totalFilesCount: number,
	groupFilesCount: number,
	creationGroupInterval: number,
): Promise<string> => {
	console.log(`[${formatDate(new Date(), true)}] Процесс создания файлов...`);

	const folderName = formatDate(new Date());
	let filesCount = 0;

	await loggerService.appendLog(await fileService.createFolder(folderName));

	await new Promise(res => setTimeout(res, 2 * 1000));

	await new Promise(res => {
		const interval = setInterval(async () => {
			for (let i = 0; i < groupFilesCount; i++) {
				const lines = [];
				for (let i = 0; i < 40; i++) lines.push(randomString(80));
				const result = await fileService.createFile(`${folderName}/${uuidv4()}`, lines.join('\n'));
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

	await new Promise(res => setTimeout(res, 2 * 1000));

	return path.resolve(creationDirectory, folderName);
};
