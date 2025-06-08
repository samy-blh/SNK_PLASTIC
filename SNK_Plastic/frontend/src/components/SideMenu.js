import React from 'react';
import { NavLink } from 'react-router-dom';

function SideMenu() {
  return (
    <nav className="side-menu">
      <ul>
        <li><NavLink to="/stocks">Stocks</NavLink></li>
        <li><NavLink to="/factures">Factures</NavLink></li>
        <li><NavLink to="/production">Suivi de production</NavLink></li>
      </ul>
    </nav>
  );
}

export default SideMenu;
