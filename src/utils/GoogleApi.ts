import { GoogleSpreadsheet } from "google-spreadsheet";
import { Name } from "../components/nameManager/NameManager";

export interface SchemasList {
	[week: string] : {
		schema: SchemaInterface
		splits: number
	}
}

export interface SchemaInterface {
	[day: string]: SchemaDayInterface
}

export interface SchemaDayInterface {
	registered: boolean,
	locked: boolean,
	options: Array<SchemaOptionInterface>
}

export interface SchemaOptionInterface {
	count: number,
	string: string,
	registered: { [id: number]: {value: string, note: string} },

}

export default class SheetApi {
	doc: GoogleSpreadsheet;
	schema: any;
	userID: string | null;
	disabled: number


	constructor(docID: string) {
		// test doc : '18wEM5Qcl_gEL25EzoX3E2aWK-8YYlupZA9HoTZ4-MeU'
		this.doc = new GoogleSpreadsheet(docID);
		let token = localStorage.getItem("accessToken")
		this.userID = localStorage.getItem("userID")
		if (!token) {
			throw new Error("invalid token")
		}
		this.doc.useRawAccessToken(token ? token : "");
		
		this.getSchema = this.getSchema.bind(this)
		this.register = this.register.bind(this)

		this.disabled = 1
	}

	async getNumberOfSheets() {
		await this.doc.loadInfo(); // loads document properties and worksheets
		return this.doc.sheetsByIndex.length
	}
	
	correctIndex(index: number) {
		return index + this.disabled
	}

	async getSchema(sheetIndex: number) {

		await this.doc.loadInfo(); // loads document properties and worksheets


		const sheet = this.doc.sheetsByIndex[sheetIndex]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
		await sheet.loadHeaderRow()

		let days = sheet.headerValues.filter(e => e); // drop empty strings




		await sheet.loadCells('A2:Z2');
		let options: Array<string> = []
		for (let i = 0; sheet.getCell(1, i).value; i++) {
			options.push(String(sheet.getCell(1, i).value))
		}

		let schema: SchemaInterface = {}
		let split = options.length / days.length

		for (let i in days) { // add options str
			schema[days[i]] = Object(options.slice(Number(i) * split, (Number(i) + 1) * split))
		}

		await sheet.loadCells('A3:Z100')
		for (let day in Object.keys(schema)) {

			let key = Object.keys(schema)[day];
			let schemaDay: SchemaDayInterface = {
				registered: false,
				locked: false,
				options: []
			}

			for (let option in schema[key]) {
				let temp: any = schema[key]
				let column = Number(day) * split + Number(option)
				var schemaOptions: SchemaOptionInterface = {
					count: 0,
					string: temp[option],
					registered: {}
				}
				try { // dirty try catch but sometimes borders value is inacessible and dunno why but that permit to fix the script ...
					for (let i = 2; sheet.getCell(i, column).borders || sheet.getCell(i+1, column).borders; i++) {
						schemaOptions.count++
						let cell = sheet.getCell(i, column)
						if (cell.value && cell.valueType === "stringValue") {
							schemaOptions.registered[Number(i)] = {value: String(cell.value), note:cell.note}
						} else if (cell.value && cell.valueType === "numberValue") {
							schemaDay.locked = true
						}

						// Handle if register
						if (cell.note ===  `gsr-${localStorage.getItem("userID")}`) {
							schemaDay.registered = true
						}

						// Handle some bad case *
						if (JSON.stringify(sheet.getCell(i, column).backgroundColor) === JSON.stringify({ red: 0.8, green: 0.8, blue: 0.8 }) ||
							JSON.stringify(sheet.getCell(i, column).backgroundColor) === JSON.stringify({ red: 0.7411765, green: 0.7411765, blue: 0.7411765 })
						) { // if cells are gray and gulf closed ..., if prod most simple is to avoid put these column just put nothing ^^
							schemaDay.locked = true
						}
					}
				}
				catch { }

				schemaDay.options.push(schemaOptions)
			}
			schema[key] = schemaDay
		}
		this.schema = schema
		return {
			schema,
			split,
			week: sheet.title
		}
	}

	private findMissing(array: number[], max: number): number[] {
		const missing = []
		for (let i = 2; i <= max; i++) {
			if (!array.includes(i)) { // Checking whether i(current value) present in num(argument)
				missing.push(i); // Adding numbers which are not in num(argument) array
			}
		}
		return missing;
	}

	async register(sheetIndex: number, column: number, names: Name[], schemas: SchemasList, split: number, cardIndex: number, optionIndex: number) {
		await this.doc.loadInfo();
		console.log(schemas[Object.keys(schemas)[sheetIndex - this.disabled]].schema)

		// Get the correct schema option:
		let schemasCopy = schemas
		let schemaCopy = schemas[Object.keys(schemas)[sheetIndex - this.disabled]].schema
		let schemaDay = schemaCopy[Object.keys(schemaCopy)[cardIndex]]
		let schemaOption = schemaDay.options[optionIndex]
		let keys = Object.keys(schemaOption.registered).map((key) => Number(key))
		let places: number[] | undefined = this.findMissing(keys, schemaOption.count + 1) // all possible places in the sheet

		const sheet = this.doc.sheetsByIndex[sheetIndex]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
		await sheet.loadCells({ // GridRange object
			startRowIndex: 2, endRowIndex: schemaOption.count + 1, startColumnIndex:column, endColumnIndex: column+1
		});
		for (let name of names) {
			if (places.length) {
				let cell = sheet.getCell(places[0], column)
				cell.value = name.name + (name.vege ? " Vege" : "")
				cell.note = `gsr-${localStorage.getItem("userID")}`
				schemaOption.registered[places[0]] = {value: name.name + (name.vege ? " Vege" : ""), note: `gsr-${localStorage.getItem("userID")}`}
				places.shift()
			}
		}
		schemaDay.registered = true
		schemaDay.options[optionIndex] = schemaOption
		schemasCopy[Object.keys(schemas)[sheetIndex - this.disabled]].schema[Object.keys(schemas)[cardIndex]] = schemaDay
		await sheet.saveUpdatedCells()
		return schemasCopy
	}
}