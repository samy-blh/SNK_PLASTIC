import React, { useState } from 'react';
import axios from 'axios';

function StockForm() {
  const [formData, setFormData] = useState({
    nom_objet: '',
    type_objet: 'produit',
    quantite: '',
    date_entree: '',
    echeance_stock: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/stocks', formData);
      alert('Stock ajouté avec succès');
      setFormData({
        nom_objet: '',
        type_objet: 'produit',
        quantite: '',
        date_entree: '',
        echeance_stock: ''
      });
    } catch (err) {
      console.error('Erreur lors de l\'ajout du stock :', err);
      alert("Erreur lors de l'ajout du stock");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Ajouter un stock</h2>
      <label>Nom de l'objet</label>
      <input type="text" name="nom_objet" value={formData.nom_objet} onChange={handleChange} required />

      <label>Type d'objet</label>
      <select name="type_objet" value={formData.type_objet} onChange={handleChange} required>
        <option value="produit">produit</option>
        <option value="matière">matière</option>
      </select>

      <label>Quantité</label>
      <input type="number" name="quantite" value={formData.quantite} onChange={handleChange} required />

      <label>Date d'entrée</label>
      <input type="date" name="date_entree" value={formData.date_entree} onChange={handleChange} required />

      <label>Échéance du stock</label>
      <input type="date" name="echeance_stock" value={formData.echeance_stock} onChange={handleChange} />

      <button type="submit" disabled={loading}>Ajouter</button>
    </form>
  );
}

export default StockForm;
