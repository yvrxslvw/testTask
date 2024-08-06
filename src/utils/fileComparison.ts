import * as fs from 'fs';
import * as path from 'path';
import { formatDate } from './formatDate';
import { timer } from './timer';
import { LoggerService } from '../services/LoggerService';
import { FileService } from '../services/FileService';

export const fileComparison = async (
	fileService: FileService,
	loggerService: LoggerService,
	resultDirectory: string,
	comparisonDirectory: string,
	waitingTime: number,
) => {
	console.log(
		`[${formatDate(
			new Date(),
			true,
		)}] Процесс сравнения каталогов... Отслеживается каталог "${comparisonDirectory}". Ожидание ${waitingTime}с`,
	);

	const creationChecksums: Record<string, string> = {};
	const comparisonChecksums: Record<string, string> = {};
	const coincidences: Record<string, string> = {};

	await new Promise(res =>
		fs.readdirSync(resultDirectory).forEach(async (file, index, arr) => {
			creationChecksums[file] = await fileService.getFileChecksum(path.resolve(resultDirectory, file));
			index === arr.length - 1 && res(undefined);
		}),
	);
	await new Promise(res =>
		fs.readdirSync(comparisonDirectory).forEach(async (file, index, arr) => {
			comparisonChecksums[file] = await fileService.getFileChecksum(path.resolve(comparisonDirectory, file));
			index === arr.length - 1 && res(undefined);
		}),
	);

	const watcher = fs.watch(comparisonDirectory, async (_, fileName) => {
		const filePath = path.resolve(comparisonDirectory, fileName ?? '');
		if (!fs.existsSync(filePath) || !fileName) return;
		comparisonChecksums[fileName] = await fileService.getFileChecksum(filePath);
		Object.keys(creationChecksums).forEach(createdFile => {
			if (creationChecksums[createdFile] === comparisonChecksums[fileName]) coincidences[createdFile] = fileName;
		});
	});
	await timer(waitingTime * 1000);
	watcher.close();
	console.log(
		`[${formatDate(new Date(), true)}] Сравнение каталогов закончено. Совпадений: ${Object.keys(coincidences).length}.`,
	);
	Object.keys(coincidences).forEach(async createdFile => {
		await loggerService.appendLog(`Совпадение файла "${createdFile}" с файлом "${coincidences[createdFile]}".`);
	});
};
