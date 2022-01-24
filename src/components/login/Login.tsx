import { useState, useEffect, SetStateAction, useContext } from 'react';
import { BiError } from 'react-icons/bi';
import { Navigate } from 'react-router-dom';
import { LoginContext } from '../LoginContext';

import './Login.scss';

function Login() {
	const { user, setUser } = useContext(LoginContext);

	if (user) {
		return <Navigate to={'/'} />;
	}
	return (
		<>
			<div className="login-alert">
				<div className="login-alert_container">
					<div className="login-alert_logo">
						<BiError />
					</div>
					<div className="login-alert_message">You need to login before using this application.</div>
				</div>
			</div>
		</>
	);
}

export default Login;
