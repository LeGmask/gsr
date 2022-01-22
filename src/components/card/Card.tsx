import SheetApi, { SchemaDayInterface } from '../../utils/GoogleApi';
import {MdLock} from "react-icons/md"
import { useState } from 'react';
import { Registered } from './Registered';
import { Options } from './Options';
import "./Card.scss"

export interface ICardProps {
	index: number
	day: string
	schemaDays: SchemaDayInterface
	sheetApi: SheetApi
	sheetSplit: number
	sheetIndex: number
}

export function Card({index, day, schemaDays, sheetApi, sheetSplit, sheetIndex}: ICardProps) {
	const [register, setIsregister] = useState(schemaDays.registered)
	
	let cardIndex = index
	return (
		<div className='card'>
			<div className="card_date">
				{schemaDays.locked ? <MdLock className='card_locked'/> : null}
				<h3>{day}</h3>
			</div>

			<div className="card_options_container">
				{ 	register
						? 
						<Registered schemaDays={schemaDays} sheetIndex={sheetIndex} cardIndex={cardIndex} sheetSplit={sheetSplit} sheetApi={sheetApi} setIsRegister={(register:boolean) => (setIsregister(register))} isLocked={schemaDays.locked}/>
						
						:
						schemaDays.options.map((option, index) => (
							<Options schemaOption={option} sheetIndex={sheetIndex} key={index} cardIndex={cardIndex} optionIndex={index} sheetSplit={sheetSplit} sheetApi={sheetApi} setIsRegister={() => (setIsregister(true))} isLocked={schemaDays.locked} />
						))
				}
			</div>
		</div>
	);
}
