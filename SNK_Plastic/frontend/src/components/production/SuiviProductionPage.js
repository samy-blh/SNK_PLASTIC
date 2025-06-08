import React from 'react';
import OFList from './OFList';
import ProductionGraph from './ProductionGraph';
import ProductionControls from './ProductionControls';

function SuiviProductionPage() {
  return (
    <div>
      <h1>Suivi de production</h1>
      <ProductionControls />
      <OFList />
      <ProductionGraph />
    </div>
  );
}

export default SuiviProductionPage;
