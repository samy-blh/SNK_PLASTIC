import React from 'react';
import StockForm from './components/StockForm';
import StockList from './components/StockList';
import SuiviProductionPage from './components/production/SuiviProductionPage';
import FactureForm from './components/factures/FactureForm';
import FactureList from './components/factures/FactureList';
import FactureGraph from './components/factures/FactureGraph';

function App() {
  return (
    <div className="App">
      <h1>Gestion des Stocks - SNK Plastic</h1>
      <StockForm />
      <hr />
      <StockList />
      <hr />
      <FactureForm />
      <hr />
      <FactureList />
      <hr />
      <FactureGraph />
      <hr />
      <SuiviProductionPage />
    </div>
  );
}

export default App;
