import { createContext } from "react";
import { Name } from "./nameManager/NameManager";


export const loadFromLocalStorage = (): Array<Name> => {
	let local = localStorage.getItem('names');
	if (local) {
		return JSON.parse(local)
	} else {
		return [{
			name: "",
			vege: false,
		}]
	}
}

interface INamesContext {
	names: Name[];
	setNames: (user:any) => void;
}
  
export const NamesContext = createContext<INamesContext>({names: loadFromLocalStorage(), setNames: (undefined) => {}})
