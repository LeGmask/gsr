import { useEffect, useState } from 'react';
import { Card } from '../components/card/Card';

import { NameManager } from '../components/nameManager/NameManager';
import { SchemaContext } from '../components/SchemaContext';
import SheetApi, { SchemasList } from '../utils/GoogleApi';

import "./Home.scss"



function Main() {
	const [schemas, setSchemas] = useState<SchemasList>({})
	const sheetApi = new SheetApi("1EQxmOav__awVA_sKOlNWvCluvBCyuFjTxsiJd2Q67ZA")
	const capitalize = (s: string) => s && s[0].toUpperCase() + s.slice(1)

	useEffect(() => {
		(async function run() {
			let sheetNumber = await sheetApi.getNumberOfSheets()
			for (let i = sheetApi.disabled; i < sheetNumber; i++) {
				let sheet = await sheetApi.getSchema(i)
				setSchemas((prevSchemas) => ({
					...prevSchemas, 
					[sheet.week]: {
						schema: sheet.schema,
						splits: sheet.split,
					}
				}));
			}
		})()
	}, [])


	return (
		<SchemaContext.Provider value={{schemas, setSchemas}}>
			<NameManager />
			{Object.keys(schemas).map((week, sheetIndex) => (

				<>
					<h1>{week}, {sheetApi.correctIndex(sheetIndex)}</h1>
					<div className="cards_container">
					{
						Object.keys(schemas[week].schema).map((day, index) => (
							<Card day={day} schemaDays={schemas[week].schema[day]} sheetIndex={sheetApi.correctIndex(sheetIndex)} index={index} sheetApi={sheetApi} sheetSplit={schemas[week].splits} key={index}/>
						))
					}
					</div>
				</>
			))}
			
		</SchemaContext.Provider>
	)

}

export default Main;
