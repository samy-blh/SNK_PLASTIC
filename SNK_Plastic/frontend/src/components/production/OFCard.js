import React from 'react';
import axios from 'axios';

function OFCard({ of, onFinish }) {
  const progress = (of.temps_ecoule + of.temps_restant) > 0
    ? (of.temps_ecoule / (of.temps_ecoule + of.temps_restant)) * 100
    : 0;

  const terminer = async () => {
    try {
      await axios.patch(`http://localhost:5000/api/production/of/${of.id}`, { etat: 'termine' });
      if (onFinish) onFinish();
    } catch (err) {
      console.error('Erreur fin OF:', err);
    }
  };

  return (
    <div className="of-card">
      <h4>OF {of.id}</h4>
      <p>Client: {of.client}</p>
      <p>Machine: {of.machine}</p>
      <div style={{ background: '#eee', height: 10 }}>
        <div style={{ background: '#0a0', width: `${progress}%`, height: '100%' }} />
      </div>
      <p>{progress.toFixed(1)}%</p>
      <button onClick={terminer}>Terminer</button>
    </div>
  );
}

export default OFCard;
