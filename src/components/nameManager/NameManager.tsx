import { NameInput } from './NameInput';

import { MdPersonAdd } from "react-icons/md"

import "./NameManager.scss"
import { useContext, useEffect, useState } from 'react';
import { NamesContext } from '../NamesManagerContext';

export interface INameManagerProps {
}

export interface Name {
	name: string,
	vege: boolean,
}


const writeLocalStorage = (names: Array<Name>) => {
	localStorage.setItem('names', JSON.stringify(names))
}

export function NameManager(props: INameManagerProps) {
	const { names, setNames } = useContext(NamesContext)

	useEffect(() => {
        writeLocalStorage(names)
    }, [names])

	const handleAddName = () => {
		setNames((prevNames:any) => [
			...prevNames,
			{ name: "", vege: false, },
		]);
	};

	const handleEditName = (newName:Name, id: number) => {
        setNames(
            names.map((name, i) =>
                i === id
                    ? { name: newName.name, vege: newName.vege }
                    : { ...name }
            )
        );
    };

	const handleDestroyName = (id: number) => {
		setNames(
            names.filter((val, i) => i!==id)
        );
	}

	

	return (
		<div className='nameManager_container'>
			<ul >
				{names.map((val, id) => (
					<li className='nameManager_input' key={id} ><NameInput name={val} updateName={(newName: Name) => (handleEditName(newName, id))} destroyable={names.length > 1} destroy={() => handleDestroyName(id)} /></li>
				))}
			</ul>
			<a className="nameManager_control new" onClick={handleAddName}><MdPersonAdd /></a>
		</div>
	);
}
