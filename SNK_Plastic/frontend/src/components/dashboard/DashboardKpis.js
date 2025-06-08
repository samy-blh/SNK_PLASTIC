import React, { useEffect, useState } from 'react';
import axios from 'axios';

function DashboardKpis({ filters }) {
  const [kpis, setKpis] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/dashboard/kpis', {
          params: filters,
        });
        setKpis(res.data);
      } catch (err) {
        console.error('Erreur chargement KPIs:', err);
      }
    };
    fetchData();
  }, [filters]);

  if (!kpis) return <p>Loading...</p>;

  return (
    <div className="kpis">
      <div className="kpi-card">
        <h3>Produits finis</h3>
        <p>{kpis.total_produits_finis}</p>
      </div>
      <div className="kpi-card">
        <h3>Rebuts</h3>
        <p>{kpis.total_rebuts}</p>
      </div>
      <div className="kpi-card">
        <h3>Restant à produire</h3>
        <p>{kpis.restant_a_produire}</p>
      </div>
    </div>
  );
}

export default DashboardKpis;
