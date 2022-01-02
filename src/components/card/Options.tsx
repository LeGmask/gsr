import { useState } from 'react';
import { RegisterButton, State } from './RegisterButton';

export interface IOptionsProps {
}

export function Options(props: IOptionsProps) {
	const [active, setActive] = useState<Boolean>(false)

	return (
		<div className='card_options_item' onMouseEnter={() => setActive(true)} onMouseLeave={() => setActive(false)}>
			{active ?
			 <div className="card_options_item_text" >Places: 10/29</div> :
			 <div className="card_options_item_text" >A emporter (retrait entre 12h et 12h30)</div>
			}
			<RegisterButton state={State.Error} style={{ "display": !active ? 'none' : 'inherit' }}/>
		</div>
	);
}
