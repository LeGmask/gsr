import { Link } from 'react-router-dom';

import { ReactComponent as Wave } from '../images/wave.svg';
import { ReactComponent as Sep } from '../images/separator-diagonal.svg';
import logo from '../images/logo_sbr.png';

import './Home.scss';

export function Home() {
	return (
		<div>
			<div className="intro">
				<div className="wrapper">
					<img src={logo} alt="Logo" />

					<p>An all-in-one webapp to register at restaurant.</p>

					<Link to={'/app'} className="control_open">
						Open
					</Link>
				</div>
			</div>
			<Wave className="separator" />

			<section className="features">
				<ul>
					<li>
						<div className="text">
							<h2 className="headline">People to register at a glance</h2>
							<div className="explanation">
								<p>
									See the people you will register in a blink of an eye. Or even add another person
									you want to register. And do it once, not <b>every</b> time.
								</p>
							</div>
						</div>
					</li>

					<li>
						<div className="text">
							<h2 className="headline">In short, your registration made easy</h2>
							<div className="explanation">
								<p>
									Select the day and the option you want in one click. If you make a mistake, don't
									worry, another click will allow you to unsubscribe.
								</p>
							</div>
						</div>
					</li>
				</ul>
			</section>
			<Sep className="separator" />
			<section className="open">
				<div className="wrapper">
					<h2>Would you like to try?</h2>
					<Link to={'/app'} className="control_open">
						Open
					</Link>
				</div>
			</section>
			<Sep className="separator rotate" />
		</div>
	);
}
