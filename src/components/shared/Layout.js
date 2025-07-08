import React from 'react';
import Header from './Header';
import Footer from './Footer';
import './Layout.scss';

const Layout = ({ children }) => {
  return (
    <div className="app-layout">
      <Header />
      <div className="content-container">
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
