import { createContext, ReactChild, useState } from "react";


interface ILoginContext {
	user: any;
	setUser: (user:any) => void;
}
  
export const LoginContext = createContext<ILoginContext>({user: undefined, setUser: (undefined) => {}})
