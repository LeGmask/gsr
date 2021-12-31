import react from 'react';

import './App.scss';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import { Test } from './pages/Test';
import { Header } from './components/header/Header';

function App() {
	return (
		<>
			<Header />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/test" element={<Test />} />
			</Routes>
		</>
	);
}

export default App;
