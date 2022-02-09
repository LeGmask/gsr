import { ReactComponent as Separator } from '../../images/footer__separator.svg';
import logo from '../../images/logo_sbr.png';
import { VscGithub } from 'react-icons/vsc';

import './Footer.scss';
import { Link } from 'react-router-dom';

export interface IFooterProps {}

export function Footer(props: IFooterProps) {
	return (
		<footer className="footer">
			<Separator className="footer__separator" />
			<div className="footer__content">
				<div className="footer__content__app">
					<img src={logo} alt="Logo" />
					<span>gsr</span>
				</div>
				<div className="footer__content__version">v{process.env.REACT_APP_VERSION}</div>
				<div className="footer__content__license">
					<span>
						Made with love and <a href="https://github.com/LeGmask/gsr">open source</a>
					</span>
					<span>
						© 2022 ‒ <a href="https://evann.tech">Evann "LeGmask" DREUMONT</a>
					</span>
				</div>
				<div className="footer__nav">
					<Link to="/">Home</Link>
					<Link to="/app">App</Link>
					<Link to="/policy">Policy</Link>
				</div>
			</div>
		</footer>
	);
}
