import { ReactChild, ReactChildren, useContext, useEffect, useState } from 'react';

import './App.scss';
import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginContext } from "./components/LoginContext"
import { Header } from './components/header/Header';
import Main from './pages/Main';
import Login from './components/login/Login';
import { Name } from './components/nameManager/NameManager';
import { loadFromLocalStorage, NamesContext } from './components/NamesManagerContext';
import { Footer } from './components/footer/Footer';
import { Policy } from './pages/Policy';

function App() {
	const [user, setUser] = useState<any>();
	const [names, setNames] = useState<Name[]>(loadFromLocalStorage());
	const setLoginInfo = (user:any) => {
		console.log('Called setLoginInfo')
		setUser(user)
	}

	return (
		<LoginContext.Provider value={{user: user, setUser: setLoginInfo}}>
			<NamesContext.Provider value={{names: names, setNames: setNames}}>
				<Header />
				<div className="content">
					<Routes>
						<Route path="/" element={<RequireAuth redirectTo="/login"><Main /></RequireAuth>} />
						<Route path="/login" element={<Login />} />
						<Route path="/policy" element={<Policy />} />
					</Routes>
				</div>
				<Footer />
			</NamesContext.Provider>
		</LoginContext.Provider>
	);
}

interface IRequireAuthProps{
	children: ReactChild | ReactChildren
	redirectTo: string
}

function RequireAuth({ children, redirectTo }: IRequireAuthProps) {
	const {user, setUser} = useContext(LoginContext);
	return user ? <>{children}</> : <Navigate to={redirectTo} />;
}

export default App;
