import React, { useState, useEffect } from 'react';
import { gapi, loadAuth2 } from 'gapi-script'

import './GoogleLogin.css';
import GoogleConnector from '../services/GoogleConnector';

export const GoogleLogin = () => {
	const [user, setUser] = useState<any>(null);
	const [username, setUsername] = useState<string>();
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [profilePicture, setProfilePicture] = useState<string>();

	const connector: any = GoogleConnector.getInstance()

	useEffect(() => {
		connector.onAuthStateChanged(onAuthStateChanged);

		return () => connector.removeAuthStateChanged(onAuthStateChanged);
	});

	const onAuthStateChanged = () => {
		setUsername(connector.getUserName() || undefined);
		setProfilePicture(connector.getUserPhotoURL() || undefined);
		setIsLoggedIn(connector.isLogged());
	};

	useEffect(() => {
		const setAuth2 = async () => {
			const auth2 = await loadAuth2(gapi, "83246947840-rsllh7coc7llp54j6cjq3pq3dpj5nupk.apps.googleusercontent.com", 'openid profile email https://www.googleapis.com/auth/spreadsheets')
			if (auth2.isSignedIn.get()) {
				connector.updateUser(auth2.currentUser.get())
			} else {
				attachSignin(document.getElementById('login_button'), auth2);
			}
		}
		setAuth2();
	}, []);

	useEffect(() => {
		if (!isLoggedIn) {
			const setAuth2 = async () => {
				const auth2 = await loadAuth2(gapi, "83246947840-rsllh7coc7llp54j6cjq3pq3dpj5nupk.apps.googleusercontent.com", 'openid profile email https://www.googleapis.com/auth/spreadsheets')
				attachSignin(document.getElementById('login_button'), auth2);
			}
			setAuth2();
		}
	}, [isLoggedIn])

	const attachSignin = (element: any, auth2: any) => {
		auth2.attachClickHandler(element, {},
			(googleUser: any) => {
				connector.updateUser(googleUser);
			}, (error: any) => {
				console.log(JSON.stringify(error))
			});
	};

	const signOut = () => {
		const auth2 = gapi.auth2.getAuthInstance();
		auth2.signOut().then(() => {
			connector.onLogout()
			console.log('User signed out.');
		});
	}

	return (

		<div className="container">
			{isLoggedIn ? <>
			<div>
				<h2>{username}</h2>
				<img src={profilePicture} alt="user profile" />
			</div>
			<div id="" className="btn logout" onClick={signOut}>
				Logout
			</div></> : null}


			<div style={{"display": isLoggedIn ? 'none' : 'inherit'}} id="login_button" className="btn login">
				Login
			</div>
		</div>
	);
}
