import React, { useEffect, useContext } from 'react';
import { Buffer } from 'buffer';
import { gapi, loadAuth2WithProps } from 'gapi-script';
import { FcGoogle } from 'react-icons/fc';

import { LoginContext } from '../LoginContext';

export const GoogleLogin = () => {
	const { user, setUser } = useContext(LoginContext);

	const updateUser = (googleUser: any) => {
		localStorage.setItem('userEmail', Buffer.from(googleUser.getBasicProfile().getEmail()).toString('base64'));
		localStorage.setItem('accessToken', googleUser.getAuthResponse(true).access_token);
		setUser(googleUser.getBasicProfile());
	};

	const attachSignin = (element: any, auth2: any) => {
		auth2.attachClickHandler(
			element,
			{},
			(googleUser: any) => {
				updateUser(googleUser);
			},
			(error: any) => {
				console.log(JSON.stringify(error));
			}
		);
	};

	useEffect(() => {
		const setAuth2 = async () => {
			const auth2 = await loadAuth2WithProps(gapi, {
				client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
				scope: 'openid profile email https://www.googleapis.com/auth/spreadsheets',
				ux_mode: 'redirect',
			});
			if (auth2.isSignedIn.get()) {
				updateUser(auth2.currentUser.get());
			} else {
				attachSignin(document.getElementById('login_button'), auth2);
			}
		};
		setAuth2();
	}, [attachSignin, updateUser]);

	useEffect(() => {
		if (!user) {
			const setAuth2 = async () => {
				const auth2 = await loadAuth2WithProps(gapi, {
					client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
					scope: 'openid profile email https://www.googleapis.com/auth/spreadsheets',
					ux_mode: 'redirect',
				});
				attachSignin(document.getElementById('login_button'), auth2);
			};
			setAuth2();
		}
	}, [user, attachSignin]);

	const signOut = () => {
		const auth2 = gapi.auth2.getAuthInstance();
		auth2.signOut().then(() => {
			setUser(null);
			localStorage.removeItem('accessToken');
			localStorage.removeItem('userEmail');
			console.log('User signed out.');
		});
	};

	return (
		<>
			{user ? (
				<>
					<a className="header_account_auth logout" onClick={signOut}>
						Logout
					</a>
					<div className="header_account">
						<div className="header_account_username">{user.getName()}</div>
						<img className="header_account_profilePicture" src={user.getImageUrl()} alt="Profile" />
					</div>
				</>
			) : null}

			<a style={{ display: user ? 'none' : 'inherit' }} id="login_button" className="header_account_auth login">
				<FcGoogle /> Login
			</a>
		</>
	);
};
