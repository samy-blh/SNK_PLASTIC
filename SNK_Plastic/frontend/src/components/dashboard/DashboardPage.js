import React, { useState } from 'react';
import DashboardKpis from './DashboardKpis';
import OFTable from './OFTable';
import DashboardFilters from './DashboardFilters';

function DashboardPage() {
  const [filters, setFilters] = useState({
    client_id: '',
    machine_id: '',
    date_from: '',
    date_to: '',
  });

  return (
    <div>
      <h1>Dashboard</h1>
      <DashboardFilters onFilterChange={setFilters} />
      <DashboardKpis filters={filters} />
      <OFTable filters={filters} />
    </div>
  );
}

export default DashboardPage;
