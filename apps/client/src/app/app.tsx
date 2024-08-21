import { Route, Routes } from 'react-router-dom';
import MainPage from '../pages/MainPage/MainPage';

import { SkeletonTheme } from 'react-loading-skeleton';
import { ClientContextProvider } from '../context/ClientContext';

export function App() {
	const name = process.env.NX_PROJECT_DOMAIN?.toUpperCase();
	if (name) {
		document.title = name!;
	}
	return (
		<div className="container">
			<SkeletonTheme baseColor="rgba(243, 247, 255, 0.3)" highlightColor="#E8EEFA">
				<Routes>
					<Route
						path="/"
						element={
							<ClientContextProvider>
								<MainPage />
							</ClientContextProvider>
						}
					/>
				</Routes>
			</SkeletonTheme>
		</div>
	);
}

export default App;
