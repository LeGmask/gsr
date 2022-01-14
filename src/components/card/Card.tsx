import { Options } from './Options';
import SheetApi, { SchemaDayInterface } from '../../utils/GoogleApi';

import "./Card.scss"
import { useState } from 'react';

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
				<h3>{day}</h3>
			</div>

			<div className="card_options_container">
				{ !schemaDays.locked ? 
						register
						? 
							<p>Registered</p>
						:
						schemaDays.options.map((option, index) => (
							<Options schemaOption={option} sheetIndex={sheetIndex} key={index} cardIndex={cardIndex} optionIndex={index} sheetSplit={sheetSplit} sheetApi={sheetApi} setIsRegister={() => (setIsregister(true))}/>
						))
					: <p>Locked</p>
				}
			</div>
		</div>
	);
}
