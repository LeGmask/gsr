import { useContext } from 'react';
import { Error } from '../components/error/Error';
import { ErrorsContext } from '../components/ErrorsContext';

function Test() {
	const { errors, setErrors } = useContext(ErrorsContext);

	const createError = () => {
		try {
			throw new TypeError(
				'Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque rerum maiores reprehenderit harum eveniet sed quos ad placeat nihil porro, velit laboriosam? Labore mollitia fugiat, perferendis soluta iure illo perspiciatis!Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque rerum maiores reprehenderit harum eveniet sed quos ad placeat nihil porro, velit laboriosam? Labore mollitia fugiat, perferendis soluta iure illo perspiciatis!Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque rerum maiores reprehenderit harum eveniet sed quos ad placeat nihil porro, velit laboriosam? Labore mollitia fugiat, perferendis soluta iure illo perspiciatis!'
			);
		} catch (e) {
			setErrors((prevErrors: Error[]) => [...prevErrors, e]);
		}
	};

	return <button onClick={() => createError()}>Toaster </button>;
}

export default Test;
