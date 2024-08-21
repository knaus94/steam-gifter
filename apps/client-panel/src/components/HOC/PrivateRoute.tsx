import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useGetPanelProxiesQuery } from '@generated/client-panel/graphql/types';

import Cookies from 'js-cookie';

type PrivateRouteProps = {
	children: ReactNode;
};

const PrivateRoute = ({ children }: PrivateRouteProps) => {
	const token = Cookies.get(process.env.NX_JWT_COOKIE_NAME!);

	if (!token) return <Navigate to="/login" />;

	return <>{children}</>;
};

export default PrivateRoute;
