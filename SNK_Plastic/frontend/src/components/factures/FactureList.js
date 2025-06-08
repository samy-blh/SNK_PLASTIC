import React, { useEffect, useState } from 'react';
import axios from 'axios';

function FactureList() {
  const [factures, setFactures] = useState([]);

  const fetchFactures = () => {
    axios.get('http://localhost:5000/api/factures')
      .then(res => setFactures(res.data))
      .catch(err => console.error('Erreur chargement factures:', err));
  };

  useEffect(() => {
    fetchFactures();
  }, []);

  const handleDelete = async id => {
    if (!window.confirm('Supprimer cette facture ?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/factures/${id}`);
      fetchFactures();
    } catch (err) {
      console.error('Erreur suppression facture:', err);
    }
  };

  return (
    <div>
      <h2>Liste des factures</h2>
      <table>
        <thead>
          <tr>
            <th>Numéro</th>
            <th>Client</th>
            <th>Produit</th>
            <th>Date</th>
            <th>Montant total</th>
            <th>Montant payé</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {factures.map(f => (
            <tr key={f.id}>
              <td>{f.numero_facture}</td>
              <td>{f.client_id}</td>
              <td>{f.produit_id}</td>
              <td>{f.date_emission}</td>
              <td>{f.montant_total}</td>
              <td>{f.montant_paye}</td>
              <td>
                <button onClick={() => handleDelete(f.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FactureList;
