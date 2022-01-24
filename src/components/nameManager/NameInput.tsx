import { ChangeEvent, useState } from 'react';

import { MdDelete } from 'react-icons/md';
import { Name } from './NameManager';

export interface INameInputProps {
	name: Name;
	updateName: Function;
	destroyable?: Boolean;
	destroy: Function;
}

export function NameInput(props: INameInputProps) {
	const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
		props.updateName({
			name: e.target.value,
			vege: props.name.vege,
		});
	};

	const handleVegeChange = () => {
		props.updateName({
			name: props.name.name,
			vege: !props.name.vege,
		});
	};

	const handleDestroy = () => {
		props.destroy();
	};
	return (
		<>
			<div className="input-field">
				<input type="text" placeholder="Name" value={props.name.name} onChange={handleNameChange} />
			</div>
			<div className="checkbox-field">
				<label>
					<input type="checkbox" checked={props.name.vege} onChange={handleVegeChange} />
					<span>Vege</span>
				</label>
			</div>
			{props.destroyable ? (
				<a className="nameManager_control" onClick={handleDestroy}>
					<MdDelete />
				</a>
			) : null}
		</>
	);
}
