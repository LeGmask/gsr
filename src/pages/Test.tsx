import { useEffect } from 'react';
import { main } from '../utils/GoogleApi';



export function Test() {
	let token: any = localStorage.getItem('accessToken')

	useEffect(() => {
		(async function run() {
			await main(token);
		})()
	}, [])


	return (
		<div>

		</div>
	);
}
