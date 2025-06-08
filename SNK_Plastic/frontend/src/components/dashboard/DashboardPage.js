import React, { useState } from 'react';
import DashboardKpis from './DashboardKpis';
import OFTable from './OFTable';
import DashboardFilters from './DashboardFilters';
import './DashboardPage.css';

function DashboardPage() {
  const [filters, setFilters] = useState({
    client_id: '',
    machine_id: '',
    date_from: '',
    date_to: '',
  });

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h1>SNK PLASTIC</h1>
        <a href="#" className="active">Dashboard</a>
        <a href="#">Stocks</a>
        <a href="#">Factures</a>
        <a href="#">Suivi de production</a>
      </aside>

      <main className="main-content">
        <h2 className="dashboard-title">Dashboard</h2>

        <div className="filters-bar">
          <DashboardFilters onFilterChange={setFilters} />
        </div>

        <DashboardKpis filters={filters} />

        <h3>Ordres de fabrication actifs</h3>
        <OFTable filters={filters} />
      </main>
    </div>
  );
}

export default DashboardPage;
