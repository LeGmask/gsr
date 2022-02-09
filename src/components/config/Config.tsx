import { useState, useEffect, SetStateAction, useContext } from 'react';
import { BiError } from 'react-icons/bi';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { LoginContext } from '../LoginContext';

function Config() {
	const navigate = useNavigate();
	const { sheetId } = useParams();

	useEffect(() => {
		let id = sheetId || '';
		localStorage.setItem('sheetId', id);
		navigate('/app');
	});

	return null;
}

export default Config;
