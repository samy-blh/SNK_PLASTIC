import React, { useState } from 'react';
import OFList from './OFList';
import ProductionForm from './ProductionForm';
import ProductionGraph from './ProductionGraph';
import ProductionFilters from './ProductionFilters';

function SuiviProductionPage() {
  const [filters, setFilters] = useState({
    client_id: '',
    machine_id: '',
    date_from: '',
    date_to: '',
  });

  return (
    <div>
      <h1>Suivi de production</h1>
      <ProductionForm />
      <ProductionFilters onFilterChange={setFilters} />
      <OFList filters={filters} />
      <ProductionGraph filters={filters} />
    </div>
  );
}

export default SuiviProductionPage;
