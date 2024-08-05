import { argsText } from '../constants/argsText';

const availArgs = {
	totalFilesCount: '--total-files-count',
	groupFilesCount: '--group-files-count',
	creationGroupInterval: '--creation-group-interval',
	noCreation: '--no-creation',
	help: '--help',
	shortHelp: '-h',
};

interface ICheckArgs {
	mode: 'creation' | 'comparison';
	totalFilesCount: number;
	groupFilesCount: number;
	creationGroupInterval: number;
}

export const checkArgs = (args: string[]): ICheckArgs => {
	if (args.length < 1) {
		console.log('Ошибка! Вы не указали аргументы при запуске программы.');
		console.log(argsText);
		process.exit(1);
	} else {
		for (const arg of args) {
			if (!Object.values(availArgs).find(val => val === arg.split('=')[0])) {
				console.log(`Ошибка! Неизвестный аргумент ${arg.split('=')[0]}.`);
				console.log(argsText);
				process.exit(1);
			}
		}

		if (args.find(val => val === availArgs.help || val === availArgs.shortHelp)) {
			console.log(argsText);
			process.exit(0);
		} else if (args.find(val => val === availArgs.noCreation)) {
			return { mode: 'comparison', creationGroupInterval: 0, groupFilesCount: 0, totalFilesCount: 0 };
		} else if (args.length < 3) {
			console.log('Ошибка! Без использования аргумента --no-creation все остальные аргументы являются обязательными.');
			console.log(argsText);
			process.exit(1);
		} else {
			let totalFilesCount: number = 0;
			let groupFilesCount: number = 0;
			let creationGroupInterval: number = 0;

			args.forEach(arg => {
				const total = arg.split('=');
				const cmd = total[0];
				const value = total[1];

				switch (cmd) {
					case availArgs.totalFilesCount:
						totalFilesCount = Number.parseInt(value);
						break;
					case availArgs.groupFilesCount:
						groupFilesCount = Number.parseInt(value);
						break;
					case availArgs.creationGroupInterval:
						creationGroupInterval = Number.parseInt(value);
						break;
				}
			});

			if (isNaN(totalFilesCount) || isNaN(groupFilesCount) || isNaN(creationGroupInterval)) {
				console.log('Ошибка! Некорректное значение одного из аргументов.');
				process.exit(1);
			}

			return { mode: 'creation', creationGroupInterval, groupFilesCount, totalFilesCount };
		}
	}
};
