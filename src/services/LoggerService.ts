import * as fs from 'fs';
import * as fsp from 'fs/promises';
import * as path from 'path';

export class LoggerService {
	private LOGS_PATH: string;

	constructor(logsPath: string) {
		this.LOGS_PATH = path.resolve('dist', logsPath);

		!fs.existsSync(this.LOGS_PATH) && fsp.mkdir(this.LOGS_PATH);
	}
}
