import React, { useEffect, useState } from 'react';
import axios from 'axios';

function FactureDetails({ id, onUpdated }) {
  const [facture, setFacture] = useState(null);

  useEffect(() => {
    if (!id) return;
    axios.get(`http://localhost:5000/api/factures/${id}`)
      .then(res => setFacture(res.data))
      .catch(err => console.error('Erreur chargement facture:', err));
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFacture(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/factures/${id}`, facture);
      alert('Facture mise à jour');
      if (onUpdated) onUpdated();
    } catch (err) {
      console.error('Erreur maj facture:', err);
    }
  };

  if (!facture) return null;

  return (
    <form onSubmit={handleSubmit}>
      <h3>Modifier facture {facture.numero_facture}</h3>
      <label>Montant total</label>
      <input type="number" name="montant_total" value={facture.montant_total} onChange={handleChange} />
      <label>Montant payé</label>
      <input type="number" name="montant_paye" value={facture.montant_paye} onChange={handleChange} />
      <button type="submit">Enregistrer</button>
    </form>
  );
}

export default FactureDetails;
