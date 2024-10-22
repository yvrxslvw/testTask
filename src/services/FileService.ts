import * as fsp from 'fs/promises';
import * as path from 'path';
import * as md5 from 'md5';

export class FileService {
	private OUTPUT_PATH: string;

	constructor(outputFolder: string) {
		this.OUTPUT_PATH = path.resolve(outputFolder);
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
			return `Файл по пути "${fPath}" успешно создан.`;
		} catch (error) {
			return `Ошибка! Файл по пути "${fPath}" не был создан. "${error}"`;
		}
	};

	public getFileChecksum = async (filePath: string): Promise<string> => {
		const fPath = path.resolve(this.OUTPUT_PATH, filePath);

		try {
			const buffer = await fsp.readFile(fPath);
			return md5(buffer);
		} catch (error) {
			return `Ошибка! Не удалось прочитать контрольную сумму файла по пути "${fPath}". "${error}"`;
		}
	};
}
