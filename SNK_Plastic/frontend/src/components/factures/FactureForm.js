import React, { useEffect, useState } from 'react';
import axios from 'axios';

function FactureForm({ onCreated }) {
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    client_id: '',
    produit_id: '',
    date_emission: '',
    montant_total: '',
    montant_paye: '',
  });

  useEffect(() => {
    axios.get('http://localhost:5000/api/clients')
      .then(res => setClients(res.data))
      .catch(err => console.error('Erreur chargement clients:', err));
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/factures', formData);
      alert('Facture créée');
      setFormData({ client_id: '', produit_id: '', date_emission: '', montant_total: '', montant_paye: '' });
      if (onCreated) onCreated();
    } catch (err) {
      console.error('Erreur création facture:', err);
      alert('Erreur création facture');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Créer une facture</h2>
      <label>Client</label>
      <select name="client_id" value={formData.client_id} onChange={handleChange} required>
        <option value="">-- Sélectionner --</option>
        {clients.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
      </select>

      <label>Produit</label>
      <input type="text" name="produit_id" value={formData.produit_id} onChange={handleChange} required />

      <label>Date d'émission</label>
      <input type="date" name="date_emission" value={formData.date_emission} onChange={handleChange} required />

      <label>Montant total</label>
      <input type="number" name="montant_total" value={formData.montant_total} onChange={handleChange} required />

      <label>Montant payé</label>
      <input type="number" name="montant_paye" value={formData.montant_paye} onChange={handleChange} required />

      <button type="submit">Créer la facture</button>
    </form>
  );
}

export default FactureForm;
