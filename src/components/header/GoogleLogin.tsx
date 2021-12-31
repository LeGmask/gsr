import React, { useState, useEffect } from 'react';
import { gapi, loadAuth2WithProps } from 'gapi-script'
import { FcGoogle } from 'react-icons/fc'

import GoogleConnector from '../../utils/GoogleConnector';

export const GoogleLogin = () => {
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
			const auth2 = await loadAuth2WithProps(gapi, { client_id: "83246947840-rsllh7coc7llp54j6cjq3pq3dpj5nupk.apps.googleusercontent.com", scope: 'openid profile email https://www.googleapis.com/auth/spreadsheets', ux_mode: 'redirect'})
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
				const auth2 = await loadAuth2WithProps(gapi, { client_id: "83246947840-rsllh7coc7llp54j6cjq3pq3dpj5nupk.apps.googleusercontent.com", scope: 'openid profile email https://www.googleapis.com/auth/spreadsheets', ux_mode: 'redirect'})
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
		<>
			{isLoggedIn ? 
				<>
					<a className="header_account_auth logout" onClick={signOut}>
						Logout
					</a>
					<div className='header_account'>
						<div className='header_account_username'>{username}</div>
						<img className='header_account_profilePicture' src={profilePicture} alt="Profile picture" />
					</div>
				</> : null}


			<a style={{ "display": isLoggedIn ? 'none' : 'inherit' }} id="login_button" className="header_account_auth login">
				<FcGoogle /> Login
			</a>
		</>
	);
}
