import { ReactChild, ReactChildren, useContext, useEffect, useState } from 'react';

import './App.scss';
import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginContext } from './components/LoginContext';
import { Header } from './components/header/Header';
import Main from './pages/Main';
import Login from './components/login/Login';
import { Name } from './components/nameManager/NameManager';
import { loadFromLocalStorage, NamesContext } from './components/NamesManagerContext';
import { Footer } from './components/footer/Footer';
import { Policy } from './pages/Policy';
import { ErrorsContext } from './components/ErrorsContext';
import Test from './pages/test';
import { Error, ErrorsInterface } from './components/error/Error';

function App() {
	const [user, setUser] = useState<any>();
	const [names, setNames] = useState<Name[]>(loadFromLocalStorage());
	const [errors, setErrors] = useState<ErrorsInterface>([]);

	const setLoginInfo = (user: any) => {
		setUser(user);
	};

	return (
		<LoginContext.Provider value={{ user: user, setUser: setLoginInfo }}>
			<NamesContext.Provider value={{ names: names, setNames: setNames }}>
				<ErrorsContext.Provider value={{ errors: errors, setErrors: setErrors }}>
					<Header />
					{Object.keys(errors).length ? (
						<div className="error_popup_container">
							{Object.keys(errors).map((index) => (
								<Error index={Number(index)} error={errors[Number(index)]} key={index} />
							))}
						</div>
					) : null}
					<div className="content">
						<Routes>
							<Route
								path="/"
								element={
									<RequireAuth redirectTo="/login">
										<Main />
									</RequireAuth>
								}
							/>
							<Route path="/login" element={<Login />} />
							<Route path="/policy" element={<Policy />} />
							<Route path="/test" element={<Test />} />
						</Routes>
					</div>
					<Footer />
				</ErrorsContext.Provider>
			</NamesContext.Provider>
		</LoginContext.Provider>
	);
}

interface IRequireAuthProps {
	children: ReactChild | ReactChildren;
	redirectTo: string;
}

function RequireAuth({ children, redirectTo }: IRequireAuthProps) {
	const { user, setUser } = useContext(LoginContext);
	return user ? <>{children}</> : <Navigate to={redirectTo} />;
}

export default App;
