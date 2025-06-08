import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function OperatorForm({ machineId: propMachineId }) {
  const params = useParams();
  const machineId = propMachineId || params.machineId;
  const [ofId, setOfId] = useState(null);
  const [quantite, setQuantite] = useState('');
  const [rebuts, setRebuts] = useState('');
  const [message, setMessage] = useState('');
  const [cumul, setCumul] = useState(0);

  const fetchCumul = async (of) => {
    try {
      const res = await axios.get('http://localhost:5000/api/production/logs', {
        params: { of_id: of },
      });
      const total = res.data.reduce((sum, l) => sum + Number(l.quantite_produite), 0);
      setCumul(total);
    } catch (err) {
      console.error('Erreur chargement cumul:', err);
    }
  };

  const loadActiveOF = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/production/active-of/${machineId}`);
      setOfId(res.data.id);
      fetchCumul(res.data.id);
    } catch (err) {
      console.error('Erreur chargement OF actif:', err);
    }
  };

  useEffect(() => {
    if (machineId) {
      loadActiveOF();
    }
  }, [machineId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ofId) return;
    try {
      await axios.post('http://localhost:5000/api/production/logs', {
        of_id: ofId,
        machine_id: machineId,
        quantite_produite: Number(quantite),
        quantite_rebuts: rebuts ? Number(rebuts) : 0,
      });
      setQuantite('');
      setRebuts('');
      setMessage('✔ Données enregistrées');
      fetchCumul(ofId);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Erreur enregistrement:', err);
      alert("Erreur lors de l'enregistrement");
    }
  };

  if (!ofId) return <p>Aucun ordre de fabrication actif</p>;

  return (
    <div className="operator-form">
      <h2>Machine {machineId}</h2>
      <p>Quantité cumulée : {cumul}</p>
      <form onSubmit={handleSubmit}>
        <label>Quantité produite</label>
        <input
          type="number"
          value={quantite}
          onChange={(e) => setQuantite(e.target.value)}
          required
        />
        <label>Rebuts</label>
        <input
          type="number"
          value={rebuts}
          onChange={(e) => setRebuts(e.target.value)}
        />
        <button type="submit">Envoyer les données</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default OperatorForm;
