import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SideMenu from './components/SideMenu';
import StockForm from './components/StockForm';
import StockList from './components/StockList';
import SuiviProductionPage from './components/production/SuiviProductionPage';
import FactureForm from './components/factures/FactureForm';
import FactureList from './components/factures/FactureList';
import FactureGraph from './components/factures/FactureGraph';
import DashboardPage from './components/dashboard/DashboardPage';

function StocksPage() {
  return (
    <div>
      <h1>Stocks</h1>
      <StockForm />
      <StockList />
    </div>
  );
}

function FacturesPage() {
  return (
    <div>
      <h1>Factures</h1>
      <FactureForm />
      <FactureList />
      <FactureGraph />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <SideMenu />
        <div className="content">
          <Routes>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/stocks" element={<StocksPage />} />
            <Route path="/factures" element={<FacturesPage />} />
            <Route path="/production" element={<SuiviProductionPage />} />
            <Route path="*" element={<DashboardPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
