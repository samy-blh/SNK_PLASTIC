import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function FactureGraph() {
  const [data, setData] = useState({ labels: [], total: [], paye: [] });

  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/factures');
      const clients = {};
      res.data.forEach(f => {
        if (!clients[f.client_id]) {
          clients[f.client_id] = { total: 0, paye: 0 };
        }
        clients[f.client_id].total += parseFloat(f.montant_total);
        clients[f.client_id].paye += parseFloat(f.montant_paye);
      });
      const labels = Object.keys(clients);
      const total = labels.map(l => clients[l].total);
      const paye = labels.map(l => clients[l].paye);
      setData({ labels, total, paye });
    } catch (err) {
      console.error('Erreur chargement factures:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h2>Montants facturés par client</h2>
      <Bar data={{
        labels: data.labels,
        datasets: [
          { label: 'Total', backgroundColor: 'rgba(75,192,192,0.4)', data: data.total },
          { label: 'Payé', backgroundColor: 'rgba(255,99,132,0.4)', data: data.paye },
        ]
      }} />
    </div>
  );
}

export default FactureGraph;
