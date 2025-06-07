import React from 'react';
import StockForm from './components/StockForm';
import StockList from './components/StockList';

function App() {
  return (
    <div className="App">
      <h1>Gestion des Stocks - SNK Plastic</h1>
      <StockForm />
      <hr />
      <StockList />
    </div>
  );
}

export default App;
