import * as React from 'react';
import { Link } from 'react-router-dom';

import logo from "../../images/logo_sbr.png"
import { GoogleLogin } from './GoogleLogin';
import "./Header.scss"

export function Header() {
	return (
		<header className='header'>
			<Link to="/" className="header_logo">
				<img src={logo}/>
				Gulf Stream
			</Link>
			<div className='header_account'>
				<GoogleLogin />
			</div>
		</header>
	);
}
