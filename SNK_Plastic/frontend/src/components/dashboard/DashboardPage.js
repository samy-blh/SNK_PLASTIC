import React from 'react';
import DashboardKpis from './DashboardKpis';
import OFTable from './OFTable';

function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <DashboardKpis />
      <OFTable />
    </div>
  );
}

export default DashboardPage;
