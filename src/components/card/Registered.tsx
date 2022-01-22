import { useContext, useEffect, useState } from "react";
import SheetApi, { SchemaDayInterface, SchemasList } from "../../utils/GoogleApi";
import { SchemaContext } from "../SchemaContext";
import {MdCancel} from "react-icons/md"

export interface IOptionsProps {
	schemaDays: SchemaDayInterface
	sheetIndex: number,
	cardIndex: number,
	sheetSplit: number,
	sheetApi: SheetApi,
	setIsRegister: Function,
	isLocked: boolean
}

export function Registered({schemaDays, sheetIndex, cardIndex, sheetSplit, sheetApi, setIsRegister, isLocked}: IOptionsProps) {
	const { schemas, setSchemas } = useContext(SchemaContext)
	const [registered, setRegistered] = useState<[number,number][]>([])

	const updateRegistered = (schemaDays:SchemaDayInterface) => {
		let state = false
		for (let index in schemaDays.options) {
			let option  = schemaDays.options[index]
			for (let key of Object.keys(option.registered)) {
				if (option.registered[Number(key)].note === `gsr-${localStorage.getItem("userEmail")}`){
					state = true
					setRegistered((prevRegistered) => ([
						...prevRegistered,
						[Number(index), Number(key)]
					]))
				}
			}
		}
		setIsRegister(state)
	}

	useEffect(() => {
		updateRegistered(schemaDays)			
	}, [schemaDays])

	let columnStart = Number(cardIndex) * sheetSplit

	const unregister = async (unregisterIndex: any, reset=false) => {
		let schemasCopy = schemas 
		let schemaDaysUpdate = await sheetApi.unregister(sheetIndex, cardIndex, columnStart, schemas, sheetSplit, unregisterIndex)
		schemasCopy[Object.keys(schemas)[sheetIndex - sheetApi.disabled]].schema[Object.keys(schemas)[cardIndex]] = schemaDaysUpdate
		setSchemas(schemasCopy)
		if (reset || !registered.filter((val) => !unregisterIndex.includes(val)).length ) {
			setIsRegister(false)
		} else {
			setRegistered((prevRegistered) => (prevRegistered.filter((val) => !unregisterIndex.includes(val))))
		}
	}

	return (
		<div className="card_unregister">
			<ul className='card_unregister_item' >
				{
					registered.map((index:any, arrayIndex) => (
						<li key={arrayIndex} >{schemaDays.options[index[0]].registered[index[1]].value} {isLocked ? null : <a  className="card_unregister_action" onClick={() => unregister([index])}><MdCancel /></a>}</li>
						
					))
				}
			</ul>
			{isLocked ? null : <a className="card_unregister_global" onClick={() => unregister(registered, true)}>Cancel</a> }
		</div>
	);
}
