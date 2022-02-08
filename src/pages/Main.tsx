import { useContext, useEffect, useState } from 'react';
import { MdOutlineSave } from 'react-icons/md';
import { Card } from '../components/card/Card';
import { ErrorsContext } from '../components/ErrorsContext';
import { Loader } from '../components/loader/Loader';

import SheetApi, { SchemaInterface, SchemasList } from '../utils/GoogleApi';

import { NameManager } from '../components/nameManager/NameManager';
import { SchemaContext } from '../components/SchemaContext';
import { SheetIdManager } from '../components/sheetId/SheetIdManager';

import './Main.scss';
import { ErrorsInterface } from '../components/error/Error';

function Main() {
	const { errors, setErrors } = useContext(ErrorsContext);
	const [loading, setLoading] = useState(false);
	const [schemas, setSchemas] = useState<SchemasList>({});
	var sheetApi = new SheetApi(localStorage.getItem('sheetId') || '');
	const capitalize = (s: string) => s && s[0].toUpperCase() + s.slice(1);

	async function updateSchema() {
		if (localStorage.getItem('sheetId')) {
			try {
				setLoading(true);
				let sheetNumber = await sheetApi.getNumberOfSheets();
				for (let i = sheetApi.disabled; i < sheetNumber; i++) {
					let sheet = await sheetApi.getSchema(i);
					setSchemas((prevSchemas) => ({
						...prevSchemas,
						[sheet.week]: {
							schema: sheet.schema,
							splits: sheet.split,
						},
					}));
				}
				setLoading(false);
			} catch (e) {
				setErrors((prevErrors: ErrorsInterface) => ({
					...prevErrors,
					[Object.keys(prevErrors).length]: e,
				}));
			}
		}
	}

	function updateSheetId() {
		sheetApi = new SheetApi(localStorage.getItem('sheetId') || '');
		updateSchema();
	}

	useEffect(() => {
		updateSchema();
	}, []);

	const checkIfDisplayable = (schema: SchemaInterface) => {
		for (let day of Object.keys(schema)) {
			if (Object.keys(schema[day].options).length) {
				return true;
			}
		}
		return false;
	};

	return (
		<SchemaContext.Provider value={{ schemas, setSchemas }}>
			<SheetIdManager updateSheetId={updateSheetId} />
			<NameManager />
			<h2 className="h2_helper">Step 3 ‒ Select days :</h2>
			{loading ? (
				<div className="cards_loader">
					<Loader />
				</div>
			) : (
				Object.keys(schemas).map((week, sheetIndex) => {
					if (checkIfDisplayable(schemas[week].schema)) {
						return (
							<div key={sheetIndex}>
								<h1 className="weeks_separator">{capitalize(week)}</h1>
								<div className="cards_container">
									{Object.keys(schemas[week].schema).map((day, index) =>
										Object.keys(schemas[week].schema[day].options).length ? (
											<Card
												day={day}
												schemaDays={schemas[week].schema[day]}
												sheetIndex={sheetApi.correctIndex(sheetIndex)}
												index={index}
												sheetApi={sheetApi}
												sheetSplit={schemas[week].splits}
												key={index}
											/>
										) : null
									)}
								</div>
							</div>
						);
					}
					return null;
				})
			)}
		</SchemaContext.Provider>
	);
}

export default Main;
