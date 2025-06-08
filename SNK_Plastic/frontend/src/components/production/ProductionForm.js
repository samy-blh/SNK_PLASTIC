import React, { useState } from 'react';
import axios from 'axios';

function ProductionForm({ onSaved }) {
  const [data, setData] = useState({
    of_id: '',
    machine_id: '',
    quantite_produite: '',
    quantite_rebuts: '',
    date_heure: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((p) => ({ ...p, [name]: value }));
  };

  const submit = async () => {
    try {
      await axios.post('http://localhost:5000/api/production/logs', {
        ...data,
        date_heure: data.date_heure || undefined,
      });
      setData({ of_id: '', machine_id: '', quantite_produite: '', quantite_rebuts: '', date_heure: '' });
      if (onSaved) onSaved();
    } catch (err) {
      console.error('Erreur sauvegarde production:', err);
      alert('Erreur ajout');
    }
  };

  return (
    <div>
      <h3>Nouvelle entrée de production</h3>
      <input name="of_id" placeholder="OF" value={data.of_id} onChange={handleChange} />
      <input name="machine_id" placeholder="Machine" value={data.machine_id} onChange={handleChange} />
      <input name="quantite_produite" placeholder="Quantité" value={data.quantite_produite} onChange={handleChange} />
      <input name="quantite_rebuts" placeholder="Rebuts" value={data.quantite_rebuts} onChange={handleChange} />
      <input type="datetime-local" name="date_heure" value={data.date_heure} onChange={handleChange} />
      <button onClick={submit}>Enregistrer</button>
    </div>
  );
}

export default ProductionForm;
