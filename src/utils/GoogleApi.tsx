import { GoogleSpreadsheet } from "google-spreadsheet";


function getUseableCells(sheet:any, column:any) {
	let useable: any = {
		count: 0,
		list: {},
		locked: false,
	}
	try { // dirty try catch but sometimes borders value is inacessible and dunno why but that permit to fix the script ...
		for (let i=2; sheet.getCell(i,column).borders; i++) {
			useable.count++
			if (sheet.getCell(i,column).value && sheet.getCell(i,column).valueType == "stringValue") {
				useable.list[Number(i)] = (sheet.getCell(i,column).value)
			} else if (sheet.getCell(i,column).value && sheet.getCell(i,column).valueType == "numberValue") {
				useable.locked = true
			}

			// Handle some bad case *
			if (JSON.stringify(sheet.getCell(i,column).backgroundColor) == JSON.stringify({ red: 0.8, green: 0.8, blue: 0.8 }) ||
				JSON.stringify(sheet.getCell(i,column).backgroundColor) == JSON.stringify({ red: 0.7411765, green: 0.7411765, blue: 0.7411765 })
			   ) { // if cells are gray and gulf closed ..., if prod most simple is to avoid put these column just put nothing ^^
				useable.locked = true
			}
		}
	}
	catch {}

	

	return useable
}


async function main(access_token: string) {

	// Initialize the sheet - doc ID is the long id in the sheets URL
	const doc = new GoogleSpreadsheet('18wEM5Qcl_gEL25EzoX3E2aWK-8YYlupZA9HoTZ4-MeU');
	// Initialize Auth - see https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication
	await doc.useRawAccessToken(access_token);



	await doc.loadInfo(); // loads document properties and worksheets
	

	const sheet = doc.sheetsByIndex[2]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
	await sheet.loadHeaderRow()

	let days = sheet.headerValues.filter(e =>  e); // drop empty strings


	

	await sheet.loadCells('A2:Z2');
	let options: Array<string> = []
	for (let i = 0; sheet.getCell(1,i).value; i++) {
		options.push(String(sheet.getCell(1,i).value))
	}

	let schema:any = {}
	let split = options.length / days.length

	for (let i in days) {
		schema[days[i]] = Object(options.slice(Number(i)*split, (Number(i)+1) * split))
	}
	
	await sheet.loadCells('A3:Z100')
	
	for (let day in Object.keys(schema)){
		let key = Object.keys(schema)[day]
		let obj:any = {}
		for (let option in schema[key]) {
			obj[schema[key][option]] = getUseableCells(sheet, Number(day) * split + Number(option))
		}
		schema[key] = obj
	}
		
	console.log(schema)



	
}

export { main };
