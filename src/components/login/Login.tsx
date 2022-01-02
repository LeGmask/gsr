import { useState, useEffect, SetStateAction } from 'react';
import { BiError } from "react-icons/bi"

import "./Login.scss";

function Login() {
	return (
		<>
			<div className="login-alert">
				<div className="login-alert_container">
					<div className="login-alert_logo">
						<BiError />
					</div>
					<div className="login-alert_message">
						You need to login before using this application.
					</div>
				</div>
			</div>
		</>
	)
}

export default Login;
