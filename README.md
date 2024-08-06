# Тестовое задание

Программа, которая произвольно создаёт файлы в каталоге А и сравнивает их с файлами в каталоге Б по контрольной сумме.

Результат сравнения логируется в журнал работы программы.

## Стэк технологий

**Основа:** NodeJS, TypeScript

**Вспомогательные библиотеки:** md5, uuid

## Запуск

Зайти в директорию проекта

```bash
  cd testTask
```

Установить зависимости

- С помощью npm
  ```bash
  npm install
  ```
- С помощью yarn
  ```bash
  yarn install
  ```

Совершить сборку

- С помощью npm
  ```bash
  npm run build
  ```
- С помощью yarn
  ```bash
  yarn build
  ```

Запустить программу

- С помощью npm

  ```bash
  npm run prod <аргументы>
  ```

- С помощью yarn
  ```bash
  yarn prod <аргументы>
  ```

## Аргументы для запуска

#### Внимание!

- Все нижеперечисленные аргументы **обязательны** чтобы программа работала (`-h, --help` не считается).
- Каталоги, указываемые в аргументах `--creation-directory` и `--comparison-directory`, **должны быть заранее созданы**, иначе программа не запустится.

#### Аргументы:

`-h, --help` Показать используемые программой аргументы;

`--creation-directory=<string value>` Каталог для работы программы (программа в нём создаст каталог с произвольными файлами и журнал работы);

`--total-files-count=<int value>` Общее количество файлов которое создаст программа в каталоге с произвольными файлами;

`--group-files-count=<int value>` Количество файлов в группе при создании произвольных файлов (программа создаёт файлы группами с заданным интервалом);

`--creation-group-interval=<int value>` Интервал в секундах, с которым будет создаваться заданное количество файлов в группе;

`--comparison-directory=<string value>` Каталог, с которым будет сравниваться новоиспечённый каталог с новыми произвольными файлами;

`--waiting-time=<int value>` Время ожидания в секундах, которое, после создания каталога с произвольными файлами, программа ждёт для внесения пользователем изменений в каталог, с которым будет происходить сравнение.

#### Базовый пример (можно использовать для копирования):

```bash
$ mkdir ./dist/output && mkdir ./dist/output/comparison
$ npm run build
$ node ./dist/index.js --creation-directory=./dist/output --total-files-count=10 --group-files-count=2 --creation-group-interval=2 --comparison-directory=./dist/output/comparison --waiting-time=15
```

Данный пример:

- создаст каталог по пути `./dist/output`,
- в нём создаст всего 10 файлов
- группами по 2 файла
- с интервалом в 2 секунды.
- Для сравнения будет выбран каталог `./dist/output/comparison`
- будет дано 15 секунд на изменение каталога для сравнения.

## Работа программы

При запуске программы происходит проверка введённых аргументов.

```typescript
if (args.length < 1)
    return throwExit(1, 'Ошибка! Вы не указали аргументы при запуске программы.');
if (args.find(val => val === availArgs.help || val === availArgs.shortHelp))
    return throwExit(0);
else if (args.length < 6) return throwExit(1, 'Ошибка! Вы указали не все аргументы.');
    for (const arg of args) {
		if (!Object.values(availArgs).find(val => val === arg.split('=')[0]))
			return throwExit(1, `Ошибка! Неизвестный аргумент ${arg.split('=')[0]}.`);
	}

if (isNaN(totalFilesCount) || isNaN(groupFilesCount) || isNaN(creationGroupInterval) || isNaN(waitingTime))
	return throwExit(1, 'Ошибка! Некорректное значение одного из аргументов.');
if (!fs.existsSync(comparisonDirectory) || !fs.existsSync(creationDirectory))
	return throwExit(1, 'Ошибка! Указанный каталог не существует.');
```

После проверки создаётся каталог для хранения произвольных файлов и запускается создание произвольных файлов с указанным количеством файлов в группе и указанным интервалом.

Названием каталога является текущие дата и время, названием каждого файла является случайно сгенерированный UUID.

```typescript
const folderName = formatDate(new Date());
let filesCount = 0;

await loggerService.appendLog(await fileService.createFolder(folderName));

await new Promise(res => {
	const interval = setInterval(async () => {
		for (let i = 0; i < groupFilesCount; i++) {
			const result = await fileService.createFile(`${folderName}/${uuidv4()}`, Date.now().toString());
			await loggerService.appendLog(result);
			filesCount++;
		}

		if (filesCount >= totalFilesCount) {
			clearInterval(interval);
			res(undefined);
		}
	}, creationGroupInterval * 1000);
});
```

После создания запускается проверка совпадений в каталоге А и в каталоге Б на указанное в аргументе `--waiting-time` время.

Создаётся три списка (ключ-значение): контрольные суммы сгенерированных файлов, контрольные суммы файлов из каталога для сравнения и совпадения.

На указанное время запускается "watcher" который наблюдает за изменениями в каталогах А и Б.

Если каталоги идеально идентичны (по контрольным суммам файлов) или проходит указанное время, то сравнение заканчивается.

```typescript
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
```

Также, стоит заметить, что каждое действие программы логируется в файле дата_время.log
