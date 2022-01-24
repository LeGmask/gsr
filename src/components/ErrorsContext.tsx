import { createContext } from 'react';

interface IErrorsContext {
	errors: any;
	setErrors: (schema: any) => void;
}

export const ErrorsContext = createContext<IErrorsContext>({
	errors: undefined,
	setErrors: () => {},
});
