import { useContext, useState } from 'react';
import SheetApi, { SchemaOptionInterface, SchemasList } from '../../utils/GoogleApi';
import { ErrorsInterface } from '../error/Error';
import { ErrorsContext } from '../ErrorsContext';
import { NamesContext } from '../NamesManagerContext';
import { SchemaContext } from '../SchemaContext';
import { RegisterButton, State } from './RegisterButton';

export interface IOptionsProps {
	schemaOption: SchemaOptionInterface;
	cardIndex: number;
	optionIndex: number;
	sheetApi: SheetApi;
	sheetSplit: number;
	sheetIndex: number;
	isLocked: boolean;
}

export function Options({
	schemaOption,
	cardIndex,
	optionIndex,
	sheetApi,
	sheetSplit,
	sheetIndex,
	isLocked,
}: IOptionsProps) {
	const { names } = useContext(NamesContext);
	const { errors, setErrors } = useContext(ErrorsContext);

	const { schemas, setSchemas } = useContext(SchemaContext);
	const [active, setActive] = useState<Boolean>(false);

	const getState = () => {
		let remain: number = schemaOption.count - Object.keys(schemaOption.registered).length;
		if (remain > names.length) {
			return State.Regular;
		} else if (remain > 0) {
			return State.Warning;
		} else {
			return State.Error;
		}
	};

	const isDisabled = getState() === State.Error;
	let column = Number(cardIndex) * sheetSplit + Number(optionIndex);

	const register = async () => {
		try {
			let schemaDay = await sheetApi.register(
				sheetIndex,
				column,
				names,
				schemas,
				sheetSplit,
				cardIndex,
				optionIndex
			);
			setSchemas((prevSchemas: SchemasList) => ({
				...prevSchemas,
				[Object.keys(prevSchemas)[sheetIndex - sheetApi.disabled]]: {
					...prevSchemas[Object.keys(prevSchemas)[sheetIndex - sheetApi.disabled]],
					schema: {
						...prevSchemas[Object.keys(prevSchemas)[sheetIndex - sheetApi.disabled]].schema,
						[Object.keys(prevSchemas[Object.keys(prevSchemas)[sheetIndex - sheetApi.disabled]].schema)[
							cardIndex
						]]: schemaDay,
					},
				},
			}));
		} catch (e) {
			setErrors((prevErrors: ErrorsInterface) => ({
				...prevErrors,
				[Object.keys(prevErrors).length]: e,
			}));
		}
	};

	return (
		<div className="card_options_item" onMouseEnter={() => setActive(true)} onMouseLeave={() => setActive(false)}>
			{active ? (
				<div className="card_options_item_text">
					Places: {Object.keys(schemaOption.registered).length}/{schemaOption.count}
				</div>
			) : (
				<div className="card_options_item_text">{schemaOption.string.trim()}</div>
			)}
			{isLocked ? null : (
				<RegisterButton
					state={getState()}
					style={{ display: !active ? 'none' : 'inherit' }}
					onClick={() => (!isDisabled ? register() : null)}
				/>
			)}
		</div>
	);
}
