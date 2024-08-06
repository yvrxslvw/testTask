import { argsText } from '../constants/argsText';
import * as fs from 'fs';
import * as path from 'path';

const availArgs = {
	creationDirectory: '--creation-directory',
	totalFilesCount: '--total-files-count',
	groupFilesCount: '--group-files-count',
	creationGroupInterval: '--creation-group-interval',
	comparisonDirectory: '--comparison-directory',
	waitingTime: '--waiting-time',
	help: '--help',
	shortHelp: '-h',
};

interface ICheckArgs {
	creationDirectory: string;
	totalFilesCount: number;
	groupFilesCount: number;
	creationGroupInterval: number;
	comparisonDirectory: string;
	waitingTime: number;
}

const throwExit = (code: number, message?: string): never => {
	message && console.log(message);
	console.log(argsText);
	process.exit(code);
};

export const checkArgs = (args: string[]): ICheckArgs => {
	if (args.length < 1) return throwExit(1, 'Ошибка! Вы не указали аргументы при запуске программы.');
	if (args.find(val => val === availArgs.help || val === availArgs.shortHelp)) return throwExit(0);
	else if (args.length < 6) return throwExit(1, 'Ошибка! Вы указали не все аргументы.');
	for (const arg of args) {
		if (!Object.values(availArgs).find(val => val === arg.split('=')[0]))
			return throwExit(1, `Ошибка! Неизвестный аргумент ${arg.split('=')[0]}.`);
	}

	let creationDirectory: string = '';
	let totalFilesCount: number = 0;
	let groupFilesCount: number = 0;
	let creationGroupInterval: number = 0;
	let comparisonDirectory: string = '';
	let waitingTime: number = 0;

	args.forEach(arg => {
		const total = arg.split('=');
		const cmd = total[0];
		const value = total[1];

		switch (cmd) {
			case availArgs.creationDirectory:
				creationDirectory = path.resolve(value);
				break;
			case availArgs.totalFilesCount:
				totalFilesCount = Number.parseInt(value);
				break;
			case availArgs.groupFilesCount:
				groupFilesCount = Number.parseInt(value);
				break;
			case availArgs.creationGroupInterval:
				creationGroupInterval = Number.parseInt(value);
				break;
			case availArgs.comparisonDirectory:
				comparisonDirectory = path.resolve(value);
				break;
			case availArgs.waitingTime:
				waitingTime = Number.parseInt(value);
				break;
		}
	});

	if (isNaN(totalFilesCount) || isNaN(groupFilesCount) || isNaN(creationGroupInterval) || isNaN(waitingTime))
		return throwExit(1, 'Ошибка! Некорректное значение одного из аргументов.');
	if (!fs.existsSync(comparisonDirectory) || !fs.existsSync(creationDirectory))
		return throwExit(1, 'Ошибка! Указанный каталог не существует.');

	return {
		creationDirectory,
		creationGroupInterval,
		groupFilesCount,
		totalFilesCount,
		comparisonDirectory,
		waitingTime,
	};
};
