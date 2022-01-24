import { createContext } from 'react';

interface ISchemaContext {
	schemas: any;
	setSchemas: (schema: any) => void;
}

export const SchemaContext = createContext<ISchemaContext>({
	schemas: undefined,
	setSchemas: () => {},
});
