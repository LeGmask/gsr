import { useContext, useEffect } from "react";
import { ErrorsContext } from "../ErrorsContext";
import {IoMdCloseCircle} from "react-icons/io"

import "./Error.scss"

export interface IErrorProps {
	index: number
	error: Error
}

export interface ErrorsInterface {
	[index: number]: Error
}

export function Error ({index, error}: IErrorProps) {
	const {errors, setErrors} = useContext(ErrorsContext)



	useEffect(() => {
		const timer = setTimeout(() => {
			setErrors((prevErrors: ErrorsInterface) => {
				const newErrors = {...prevErrors}
				delete newErrors[index]
				return newErrors
			})
		}, 10000);
		return () => clearTimeout(timer);
	  }, []);

		
	return (
		<div className="error_popup">
			<a className="error_popup_close" onClick={() => setErrors((prevErrors: Error[]) => setErrors((prevErrors: ErrorsInterface) => {
				const newErrors = {...prevErrors}
				delete newErrors[index]
				return newErrors
			}))}><IoMdCloseCircle/></a>
			<h1 className="error_popup_title">{error.name}</h1>
			<p className="error_popup_message">{error.message}</p>
		</div>
	);
}
