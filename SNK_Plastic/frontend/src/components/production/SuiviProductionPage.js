import React, { useState } from 'react';
import OFList from './OFList';
import ProductionForm from './ProductionForm';
import ProductionGraph from './ProductionGraph';
import ProductionFilters from './ProductionFilters';

function SuiviProductionPage() {
  const [filters, setFilters] = useState({});
  const [graphMode, setGraphMode] = useState('client');

  return (
    <div>
      <h1>Suivi de production</h1>
      <ProductionForm />
      <ProductionFilters filters={filters} onChange={setFilters} />
      <OFList filters={filters} />
      <div>
        <select value={graphMode} onChange={(e) => setGraphMode(e.target.value)}>
          <option value="client">Par client</option>
          <option value="machine">Par machine</option>
        </select>
        <ProductionGraph mode={graphMode} />
      </div>
    </div>
  );
}

export default SuiviProductionPage;
