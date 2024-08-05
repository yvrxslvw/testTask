import * as fs from 'fs';
import * as fsp from 'fs/promises';
import * as path from 'path';

export class FileService {
	private OUTPUT_PATH: string;

	constructor(outputFolder: string) {
		this.OUTPUT_PATH = path.resolve('dist', outputFolder);

		!fs.existsSync(this.OUTPUT_PATH) && fsp.mkdir(this.OUTPUT_PATH);
	}
}
