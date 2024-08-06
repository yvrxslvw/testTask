import * as fs from 'fs';
import * as path from 'path';
import { formatDate } from './formatDate';
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
	await new Promise(res => {
		const files = fs.readdirSync(comparisonDirectory);
		if (files.length === 0) return res(undefined);
		files.forEach(async (file, index, arr) => {
			comparisonChecksums[file] = await fileService.getFileChecksum(path.resolve(comparisonDirectory, file));
			index === arr.length - 1 && res(undefined);
		});
	});

	const creationWatcher = fs.watch(resultDirectory, async (_, newFileName) => {
		const filePath = path.resolve(resultDirectory, newFileName ?? '');
		if (!fs.existsSync(filePath) || !newFileName) return;
		const checksum = await fileService.getFileChecksum(filePath);
		Object.keys(creationChecksums).forEach(oldFileName => {
			if (creationChecksums[oldFileName] === checksum) {
				delete creationChecksums[oldFileName];
				creationChecksums[newFileName] = checksum;
				Object.keys(coincidences).forEach(key => {
					if (key === oldFileName) {
						const fileBName = coincidences[key];
						delete coincidences[key];
						coincidences[newFileName] = fileBName;
					}
				});
			}
		});
	});

	const comparisonWatcher = fs.watch(comparisonDirectory, async (_, fileName) => {
		const filePath = path.resolve(comparisonDirectory, fileName ?? '');
		if (!fs.existsSync(filePath) || !fileName) return;
		comparisonChecksums[fileName] = await fileService.getFileChecksum(filePath);
		Object.keys(creationChecksums).forEach(createdFile => {
			if (creationChecksums[createdFile] === comparisonChecksums[fileName]) coincidences[createdFile] = fileName;
		});
	});

	let tick = 0;
	await new Promise(res => {
		let interval = setInterval(() => {
			tick++;
			if (tick >= waitingTime || Object.keys(coincidences).length === Object.keys(creationChecksums).length) {
				clearInterval(interval);
				res(undefined);
			}
		}, 1000);
	});

	creationWatcher.close();
	comparisonWatcher.close();
	console.log(
		`[${formatDate(new Date(), true)}] Сравнение каталогов закончено. Совпадений: ${
			Object.keys(coincidences).length
		} из ${Object.keys(creationChecksums).length}.`,
	);
	
	Object.keys(coincidences).forEach(async createdFile => {
		await loggerService.appendLog(`Совпадение файла "${createdFile}" с файлом "${coincidences[createdFile]}".`);
	});

	await new Promise(res => setTimeout(res, 2 * 1000));
	Object.keys(creationChecksums).forEach(async file => {
		if (!Object.values(comparisonChecksums).find(val => creationChecksums[file] === val))
			await loggerService.appendLog(
				`Файла с контрольной суммой ${creationChecksums[file]} (название файла: ${file}) не существует в каталоге сравнения (Каталог Б).`,
			);
	});

	await new Promise(res => setTimeout(res, 2 * 1000));
	Object.keys(comparisonChecksums).forEach(async file => {
		if (!Object.values(creationChecksums).find(val => comparisonChecksums[file] === val))
			await loggerService.appendLog(
				`Файла с контрольной суммой ${comparisonChecksums[file]} (название файла: ${file}) не существует в каталоге создания (Каталог А).`,
			);
	});
};
