import { GoogleSpreadsheet } from 'google-spreadsheet';
import { Name } from '../components/nameManager/NameManager';

export interface SchemasList {
	[week: string]: {
		schema: SchemaInterface;
		splits: number;
	};
}

export interface SchemaInterface {
	[day: string]: SchemaDayInterface;
}

export interface SchemaDayInterface {
	registered: boolean;
	locked: boolean;
	options: Array<SchemaOptionInterface>;
}

export interface SchemaOptionInterface {
	count: number;
	string: string;
	registered: { [id: number]: { value: string; note: string } };
}

export default class SheetApi {
	doc: GoogleSpreadsheet;
	schema: any;
	userEmail: string | null;
	disabled: number;

	constructor(docID: string) {
		// test doc : '18wEM5Qcl_gEL25EzoX3E2aWK-8YYlupZA9HoTZ4-MeU'
		this.doc = new GoogleSpreadsheet(docID);
		let token = localStorage.getItem('accessToken');
		this.userEmail = localStorage.getItem('userEmail');
		if (!token) {
			throw new Error('invalid token');
		}
		this.doc.useRawAccessToken(token ? token : '');

		this.getSchema = this.getSchema.bind(this);
		this.register = this.register.bind(this);

		this.disabled = 1;
	}

	async getNumberOfSheets() {
		await this.doc.loadInfo(); // loads document properties and worksheets
		return this.doc.sheetsByIndex.length;
	}

	correctIndex(index: number) {
		return index + this.disabled;
	}

	private addDays(days: number) {
		var result = new Date('12/30/1899');
		result.setDate(result.getDate() + days);
		return result;
	}

	async getSchema(sheetIndex: number) {
		await this.doc.loadInfo(); // loads document properties and worksheets
		let headerRowIndex = 0;

		const sheet = this.doc.sheetsByIndex[sheetIndex];

		try {
			// if header empty, because of a new line before the start of the sheet, there is an exception but this isn't important in our case
			await sheet.loadHeaderRow();
		} catch {}

		// ugly fix : when no data in the first cell try next line, if more than 10 lines breack and throw new error
		while (headerRowIndex <= 10 && (!sheet.headerValues || !sheet.headerValues[0])) {
			headerRowIndex++;
			try {
				await sheet.loadHeaderRow(headerRowIndex + 1);
			} catch {}
		}

		if (!sheet.headerValues || !sheet.headerValues[0]) {
			throw new Error(`The sheet n??${sheetIndex + 1} seems to be without data, skipping...`);
		}

		console.log(sheet.headerValues);
		let days = sheet.headerValues.filter((e) => e);

		// plus 2 and 3 beacause 1 based index
		await sheet.loadCells(`A${headerRowIndex + 1}:Z${headerRowIndex + 2}`);
		let options: Array<string> = [];
		for (let i = 0; sheet.getCell(headerRowIndex + 1, i).value; i++) {
			options.push(String(sheet.getCell(headerRowIndex + 1, i).value));
		}

		let schema: SchemaInterface = {};
		let split = options.length / days.length;

		for (let i in days) {
			// add options str
			schema[days[i]] = Object(options.slice(Number(i) * split, (Number(i) + 1) * split));
		}

		// Here we drop allready passed days
		let ignoreIndex: Number[] = [];
		for (let i in days) {
			console.log(headerRowIndex);
			let date = this.addDays(Number(sheet.getCell(headerRowIndex, Number(i) * split).value));
			let today = new Date(Date.now());
			today.setHours(0, 0, 0, 0); // set today to midnight to permit comparaison between date and today
			if (date < today) {
				ignoreIndex.push(Number(i));
			}
		}

		// TODO: avoid loading when not need by simply adding an empty object ... (and symplify main.tsx)
		// Load sheets
		if (ignoreIndex.length < days.length) {
			await sheet.loadCells(`A${headerRowIndex + 2}:Z100`);
		}

		for (let day in Object.keys(schema)) {
			let key = Object.keys(schema)[day];
			let schemaDay: SchemaDayInterface = {
				registered: false,
				locked: false,
				options: [],
			};

			// skip if day allready passed ...
			if (ignoreIndex.indexOf(Number(day)) === -1) {
				for (let option in schema[key]) {
					let temp: any = schema[key];
					let column = Number(day) * split + Number(option);
					var schemaOptions: SchemaOptionInterface = {
						count: 0,
						string: temp[option],
						registered: {},
					};
					try {
						// dirty try catch but sometimes borders value is inacessible and dunno why but that permit to fix the script ...
						for (
							let i = 2;
							sheet.getCell(headerRowIndex + i, column).borders ||
							sheet.getCell(headerRowIndex + i + 1, column).borders;
							i++
						) {
							schemaOptions.count++;
							let cell = sheet.getCell(headerRowIndex + i, column);
							if (cell.value && cell.valueType === 'stringValue') {
								schemaOptions.registered[Number(i)] = {
									value: String(cell.value),
									note: cell.note,
								};
							} else if (cell.value && cell.valueType === 'numberValue') {
								schemaDay.locked = true;
							}

							// Handle if register
							if (cell.note === `gsr-${localStorage.getItem('userEmail')}`) {
								schemaDay.registered = true;
							}

							// Handle some bad case *
							if (
								JSON.stringify(sheet.getCell(headerRowIndex + i, column).backgroundColor) ===
									JSON.stringify({
										red: 0.8,
										green: 0.8,
										blue: 0.8,
									}) ||
								JSON.stringify(sheet.getCell(headerRowIndex + i, column).backgroundColor) ===
									JSON.stringify({
										red: 0.7411765,
										green: 0.7411765,
										blue: 0.7411765,
									})
							) {
								// if cells are gray and gulf closed ..., if prod most simple is to avoid put these column just put nothing ^^
								schemaDay.locked = true;
							}
						}
					} catch {}

					schemaDay.options.push(schemaOptions);
				}
			}
			schema[key] = schemaDay; // set default if not found
		}
		this.schema = schema;
		return {
			schema,
			split,
			week: sheet.title,
		};
	}

	private findMissing(array: number[], max: number): number[] {
		const missing = [];
		for (let i = 2; i <= max; i++) {
			if (!array.includes(i)) {
				// Checking whether i(current value) present in num(argument)
				missing.push(i); // Adding numbers which are not in num(argument) array
			}
		}
		return missing;
	}

	async register(
		sheetIndex: number,
		column: number,
		names: Name[],
		schemas: SchemasList,
		split: number,
		cardIndex: number,
		optionIndex: number
	) {
		await this.doc.loadInfo();

		names = names.filter((name) => name.name);

		if (!names.length) {
			throw new Error('Unable to register a ghost, please complete step 2 before attempting to register.');
		}

		// Get the correct schema option:
		let schemasCopy = JSON.parse(JSON.stringify(schemas));
		let schemaCopy = schemasCopy[Object.keys(schemasCopy)[sheetIndex - this.disabled]].schema;
		let schemaDay = schemaCopy[Object.keys(schemaCopy)[cardIndex]];
		let schemaOption = schemaDay.options[optionIndex];
		let keys = Object.keys(schemaOption.registered).map((key) => Number(key));
		let places: number[] | undefined = this.findMissing(keys, schemaOption.count + 1); // all possible places in the sheet

		const sheet = this.doc.sheetsByIndex[sheetIndex]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
		await sheet.loadCells({
			// GridRange object, +2 because it's [A;B[  interval ...
			startRowIndex: 2,
			endRowIndex: schemaOption.count + 2,
			startColumnIndex: column,
			endColumnIndex: column + 1,
		});

		// drop updated cell
		let remove: Number[] = [];
		for (let place of places) {
			let cell = sheet.getCell(place, column);
			if (cell.value !== null) {
				schemaOption.registered[places[place]] = {
					value: String(cell.value),
					note: cell.note,
				};
				remove.push(place);
			}
		}
		places = places.filter(function (value) {
			return remove.indexOf(value) === -1;
		});

		for (let name of names) {
			if (places.length) {
				let cell = sheet.getCell(places[0], column);
				cell.value = name.name + (name.vege ? ' Vege' : '');
				cell.note = `gsr-${localStorage.getItem('userEmail')}`;
				schemaOption.registered[places[0]] = {
					value: name.name + (name.vege ? ' Vege' : ''),
					note: `gsr-${localStorage.getItem('userEmail')}`,
				};
				places.shift();

				// Format cell, and if lbm set color to red
				cell.textFormat = {
					fontSize: 14,
					fontFamily: 'Arial',
					foregroundColor: {
						red: /\blbm[1-2]\b/g.test(name.name.toLowerCase()) ? 1 : 0,
						green: 0,
						blue: 0,
						alpha: 1,
					},
				};
			} else {
				console.log('ya plus de place ...');
			}
		}
		schemaDay.registered = true;
		schemaDay.options[optionIndex] = schemaOption;
		await sheet.saveUpdatedCells();
		return schemaDay;
	}

	async unregister(
		sheetIndex: number,
		cardIndex: number,
		columnStart: number,
		schemas: SchemasList,
		split: number,
		unregister: [number, number][]
	) {
		await this.doc.loadInfo();

		let schemasCopy: SchemasList = JSON.parse(JSON.stringify(schemas));
		let schemaCopy = schemasCopy[Object.keys(schemas)[sheetIndex - this.disabled]].schema;
		let schemaDay = schemaCopy[Object.keys(schemaCopy)[cardIndex]];
		let count = [];
		for (let option of schemaDay.options) {
			count.push(option.count);
		}

		const sheet = this.doc.sheetsByIndex[sheetIndex]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
		await sheet.loadCells({
			// GridRange object, +2 we start at index 2...
			startRowIndex: 2,
			endRowIndex: Math.max(...count) + 2,
			startColumnIndex: columnStart,
			endColumnIndex: columnStart + split + 1,
		});

		for (let index of unregister) {
			delete schemaDay.options[index[0]].registered[index[1]];
			let cell = sheet.getCell(index[1], columnStart + index[0]);

			cell.value = '';
			cell.note = '';
		}
		await sheet.saveUpdatedCells();
		return schemaDay;
	}
}
