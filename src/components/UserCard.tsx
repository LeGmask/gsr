import React, { useEffect, useState } from 'react';
import GoogleConnector from '../services/GoogleConnector';

export const UserCard = () => {
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

	return (
		<div>
			<h2>{username}</h2>
			<img src={profilePicture} alt="user profile" />
		</div>
	);
}
