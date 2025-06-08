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

function ProductionGraph({ mode }) {
  const [data, setData] = useState({ labels: [], rebuts: [], produite: [] });

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/production/logs/graph', {
        params: { filter: mode || 'client' },
      });
      const labels = res.data.map((r) => r.label);
      const produite = res.data.map((r) => r.quantite_produite);
      const rebuts = res.data.map((r) => r.quantite_rebuts);
      setData({ labels, produite, rebuts });
    } catch (err) {
      console.error('Erreur chargement graph:', err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [mode]);

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Produits',
        backgroundColor: 'rgba(75,192,192,0.4)',
        data: data.produite,
      },
      {
        label: 'Rebuts',
        backgroundColor: 'rgba(255,99,132,0.4)',
        data: data.rebuts,
      },
    ],
  };

  return (
    <div>
      <h2>Statistiques par {mode || 'client'}</h2>
      <Bar data={chartData} />
    </div>
  );
}

export default ProductionGraph;
