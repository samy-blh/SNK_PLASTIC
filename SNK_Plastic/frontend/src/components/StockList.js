import React, { useEffect, useState } from 'react';
import axios from 'axios';

function StockList() {
  const [stocks, setStocks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/stocks')
      .then(res => {
        setStocks(res.data);
        setError(null);
      })
      .catch(err => {
        console.error('Erreur lors de la récupération des stocks :', err);
        setError('Erreur lors du chargement des stocks');
      });
  }, []);

  return (
    <div>
      <h2>Liste des stocks</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Type</th>
            <th>Quantité</th>
            <th>Date entrée</th>
            <th>Échéance</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map(stock => (
            <tr key={stock.id || stock.stock_id || `${stock.nom_objet}-${stock.date_entree}`}> 
              <td>{stock.nom_objet}</td>
              <td>{stock.type_objet}</td>
              <td>{stock.quantite}</td>
              <td>{stock.date_entree}</td>
              <td>{stock.echeance_stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StockList;
