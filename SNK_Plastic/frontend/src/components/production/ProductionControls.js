import React, { useState } from 'react';
import axios from 'axios';

function ProductionControls() {
  const [formData, setFormData] = useState({
    of_id: '',
    machine_id: '',
    temps_ecoule: '',
    temps_restant: '',
    quantite_produite: '',
    quantite_rebuts: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const startProduction = async () => {
    try {
      await axios.post('http://localhost:5000/api/production/start', { of_id: formData.of_id });
      alert('Production démarrée');
    } catch (err) {
      console.error('Erreur start:', err);
    }
  };

  const updateProduction = async () => {
    try {
      await axios.put('http://localhost:5000/api/production/update', formData);
      alert('Production mise à jour');
    } catch (err) {
      console.error('Erreur update:', err);
    }
  };

  const declareRebuts = async () => {
    try {
      await axios.post('http://localhost:5000/api/production/rebuts', {
        of_id: formData.of_id,
        machine_id: formData.machine_id,
        quantite_rebuts: formData.quantite_rebuts,
      });
      alert('Rebuts déclarés');
    } catch (err) {
      console.error('Erreur rebuts:', err);
    }
  };

  return (
    <div>
      <h2>Contrôles production</h2>
      <div>
        <label>OF ID</label>
        <input name="of_id" value={formData.of_id} onChange={handleChange} />
        <label>Machine ID</label>
        <input name="machine_id" value={formData.machine_id} onChange={handleChange} />
      </div>
      <div>
        <label>Temps écoulé</label>
        <input name="temps_ecoule" value={formData.temps_ecoule} onChange={handleChange} />
        <label>Temps restant</label>
        <input name="temps_restant" value={formData.temps_restant} onChange={handleChange} />
      </div>
      <div>
        <label>Quantité produite</label>
        <input name="quantite_produite" value={formData.quantite_produite} onChange={handleChange} />
        <label>Quantité rebuts</label>
        <input name="quantite_rebuts" value={formData.quantite_rebuts} onChange={handleChange} />
      </div>
      <button onClick={startProduction}>Démarrer production</button>
      <button onClick={updateProduction}>Mettre à jour</button>
      <button onClick={declareRebuts}>Déclarer rebuts</button>
    </div>
  );
}

export default ProductionControls;
