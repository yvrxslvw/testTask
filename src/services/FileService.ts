import * as fs from 'fs';
import * as fsp from 'fs/promises';
import * as path from 'path';

export class FileService {
	private OUTPUT_PATH: string;

	constructor(outputFolder: string) {
		this.OUTPUT_PATH = path.resolve('dist', outputFolder);

		!fs.existsSync(this.OUTPUT_PATH) && fsp.mkdir(this.OUTPUT_PATH);
	}

	public createFolder = async (folderPath: string, folderName: string): Promise<string> => {
		const fPath = path.resolve(this.OUTPUT_PATH, folderPath, folderName);

		try {
			await fsp.mkdir(fPath);
			return `Папка по пути "${fPath}" успешно создана.`;
		} catch (error) {
			return `Ошибка! Папка по пути "${fPath}" не была создана. "${error}"`;
		}
	};
}
