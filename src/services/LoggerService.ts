import * as fs from 'fs';
import * as fsp from 'fs/promises';
import * as path from 'path';
import { formatDate } from '../utils/formatDate';

export class LoggerService {
	private LOGS_PATH: string;

	private FILE_NAME: string;

	constructor(logsPath: string) {
		this.LOGS_PATH = path.resolve(logsPath);
		this.FILE_NAME = formatDate(new Date()) + '.log';

		!fs.existsSync(this.LOGS_PATH) && fsp.mkdir(this.LOGS_PATH);
	}

	public appendLog = async (content: string): Promise<void> => {
		const fPath = path.resolve(this.LOGS_PATH, this.FILE_NAME);

		try {
			await fsp.appendFile(fPath, `[${formatDate(new Date(), true)}] ` + content + `\n`);
		} catch (error) {
			console.log(`Ошибка! Не удалось записать лог "${content}". "${error}"`);
		}
	};
}
