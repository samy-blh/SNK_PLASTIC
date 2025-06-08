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

function ProductionGraph({ filters }) {
  const [data, setData] = useState({ labels: [], rebuts: [], produite: [] });

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/production/logs/graph', {
        params: filters,
      });
      const labels = res.data.map((r) => r.date);
      const produite = res.data.map((r) => r.total_produite);
      const rebuts = res.data.map((r) => r.total_rebuts);
      setData({ labels, produite, rebuts });
    } catch (err) {
      console.error('Erreur chargement graph:', err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [filters]);

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
      <h2>Production</h2>
      <Bar data={chartData} />
    </div>
  );
}

export default ProductionGraph;
