import * as React from 'react';
import { Options } from './Options';

import "./Card.scss"

export interface ICardProps {
}

export function Card(props: ICardProps) {
	return (
		<div className='card'>
			<div className="card_date">
				<h3>Lundi 01/10</h3>
			</div>

			<div className="card_options_container">
				<Options />
				<Options />
				<Options />
			</div>
		</div>
	);
}
