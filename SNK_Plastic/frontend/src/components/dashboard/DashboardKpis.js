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
    <div className="kpi-container">
      <div className="kpi-box">
        <h4>Produits finis</h4>
        <div className="kpi-value">{kpis.total_produits_finis}</div>
      </div>
      <div className="kpi-box">
        <h4>Rebuts</h4>
        <div className="kpi-value">{kpis.total_rebuts}</div>
      </div>
      <div className="kpi-box">
        <h4>Restant à produire</h4>
        <div className="kpi-value">{kpis.restant_a_produire}</div>
      </div>
    </div>
  );
}

export default DashboardKpis;
