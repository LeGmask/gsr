import { useContext, useEffect, useState } from 'react';

import './App.scss';
import { Route, Routes } from 'react-router-dom';
import { LoginContext } from "./components/LoginContext"
import { Test } from './pages/Test';
import { Header } from './components/header/Header';
import Main from './pages/Main';

function App() {
	const [user, setUser] = useState<any>();
	const setLoginInfo = (user:any) => {
		console.log('Called setLoginInfo')
		setUser(user)
	}

	return (
		<LoginContext.Provider value={{user: user, setUser: setLoginInfo}}>
			<Header />
			<Routes>
				<Route path="/" element={<Main />} />
				<Route path="/test" element={<Test />} />
			</Routes>
		</LoginContext.Provider>
	);
}

export default App;
