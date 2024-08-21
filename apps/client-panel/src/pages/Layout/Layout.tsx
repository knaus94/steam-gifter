import { Outlet, useRoutes } from 'react-router-dom';
import './Layout.scss';
import SideBar from '../../components/SideBar/SideBar';
import Header from '../../components/Header/Header';

const Layout = () => {
	return (
		<div className="app">
			<Header />
			<div className="main-wrap">
				<SideBar />
				<main className="wrap">
					<Outlet />
				</main>
			</div>
		</div>
	);
};

export default Layout;
