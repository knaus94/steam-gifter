import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import PrivateRoute from '../components/HOC/PrivateRoute';
import NotFound from '../components/NotFound/NotFound';
import Bots from '../pages/Bots/Bots';
import GifsEdit from '../pages/Gifts/GifsEdit/GifsEdit';
import Gifts from '../pages/Gifts/Gifts';
import GiftsCreate from '../pages/Gifts/GiftsCreate/GiftsCreate';
import Layout from '../pages/Layout/Layout';
import Login from '../pages/Login/Login';
import Products from '../pages/Products/Products';
import Proxy from '../pages/Proxy/Proxy';
import Settings from '../pages/Settings/Settings';
import Transactions from '../pages/Transactions/Transactions';
import { useMeLazyQuery } from '@generated/client-panel/graphql/types';
import { ApolloError } from '@apollo/client';
import Cookies from 'js-cookie';
import { useEffect } from 'react';

export function App() {
	const [getMe] = useMeLazyQuery();
	const navigate = useNavigate();
	const token = Cookies.get(process.env.NX_JWT_COOKIE_NAME!);

	useEffect(() => {
		if (!token) return;

		(async () => {
			const { error } = await getMe();
			if (error instanceof ApolloError) {
				Cookies.remove('token');
				navigate('/login');
			}
		})();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [token]);

	return (
		<Routes>
			<Route path="/" element={<Navigate to="/transactions" replace />} />
			<Route
				path="/"
				element={
					<PrivateRoute>
						<Layout />
					</PrivateRoute>
				}
			>
				<Route path="proxy" element={<Proxy />} />
				<Route path="bots" element={<Bots />} />
				<Route path="settings" element={<Settings />} />
				<Route path="products" element={<Products />} />
				<Route path="gifts" element={<Gifts />}></Route>
				<Route path="gifts/create" element={<GiftsCreate />} />
				<Route path="gifts/edit/:id" element={<GifsEdit />} />
				<Route path="transactions" element={<Transactions />}></Route>
			</Route>
			<Route path="/login" element={<Login />}></Route>
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
}

export default App;
