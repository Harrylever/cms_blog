import React from 'react';
import Header from './Header';

const Layout = ({children}: {children: React.ReactNode}) => (
	<>
		<Header />
		{ children }
	</>
);

export default Layout;
