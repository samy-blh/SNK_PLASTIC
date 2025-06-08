import React, { useEffect, useState } from 'react';
import axios from 'axios';

function OFTable({ filters }) {
  const [ofs, setOfs] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/dashboard/ofs', {
          params: filters,
        });
        setOfs(res.data);
      } catch (err) {
        console.error('Erreur chargement OF actifs:', err);
      }
    };
    fetchData();
  }, [filters]);

  if (!ofs) return <p>Loading...</p>;

  return (
    <table className="of-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Client</th>
          <th>Machine</th>
            <th>Quantité commandée</th>
            <th>Quantité produite</th>
            <th>Rebuts</th>
            <th>Restant</th>
            <th>Temps écoulé</th>
          <th>Statut</th>
        </tr>
      </thead>
      <tbody>
        {ofs.map((of) => (
          <tr key={of.id}>
              <td>{of.id}</td>
              <td>{of.client}</td>
              <td>{of.machine}</td>
              <td>{of.quantite_commande}</td>
              <td>{of.quantite_produite}</td>
              <td style={{ color: of.rebuts > 0 ? 'red' : 'inherit' }}>{of.rebuts}</td>
              <td>{of.restant}</td>
              <td>{of.temps_ecoule}</td>
            <td>{of.etat}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default OFTable;
