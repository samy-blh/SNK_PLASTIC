import React from 'react';
import StockForm from './components/StockForm';
import StockList from './components/StockList';
import SuiviProductionPage from './components/production/SuiviProductionPage';

function App() {
  return (
    <div className="App">
      <h1>Gestion des Stocks - SNK Plastic</h1>
      <StockForm />
      <hr />
      <StockList />
      <hr />
      <SuiviProductionPage />
    </div>
  );
}

export default App;
