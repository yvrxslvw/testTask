import * as fs from 'fs';
import * as fsp from 'fs/promises';
import * as path from 'path';

export class FileService {
	private OUTPUT_PATH: string;

	constructor(outputFolder: string) {
		this.OUTPUT_PATH = path.resolve('dist', outputFolder);

		!fs.existsSync(this.OUTPUT_PATH) && fsp.mkdir(this.OUTPUT_PATH);
	}

	public createFolder = async (folderPath: string): Promise<string> => {
		const fPath = path.resolve(this.OUTPUT_PATH, folderPath);

		try {
			await fsp.mkdir(fPath);
			return `Папка по пути "${fPath}" успешно создана.`;
		} catch (error) {
			return `Ошибка! Папка по пути "${fPath}" не была создана. "${error}"`;
		}
	};

	public createFile = async (filePath: string, content: string): Promise<string> => {
		const fPath = path.resolve(this.OUTPUT_PATH, filePath);

		try {
			await fsp.writeFile(fPath, content);
			return `Файл по пути "${fPath}" с контентом "${content}" успешно создан.`;
		} catch (error) {
			return `Ошибка! Файл по пути "${fPath}" не был создан. "${error}"`;
		}
	};
}
