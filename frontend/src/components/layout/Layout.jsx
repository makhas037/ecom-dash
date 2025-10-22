// src/components/layout/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom'; // To render child routes
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import './Layout.css';

function Layout() {
  return (
    <div className="dashboard-layout">
      <div className="layout-sidebar">
        <Sidebar />
      </div>
      <div className="layout-navbar">
        <Navbar />
      </div>
      <main className="layout-main">
        <Outlet /> {/* Child pages like Executive.jsx will render here */}
      </main>
    </div>
  );
}

export default Layout;
