import React, { useEffect, useState } from 'react';
import axios from 'axios';

function OFList() {
  const [ofs, setOfs] = useState([]);
  const [clientFilter, setClientFilter] = useState('');
  const [machineFilter, setMachineFilter] = useState('');
  const [loaded, setLoaded] = useState(false);

  const fetchOfs = async () => {
    try {
      const params = {};
      if (clientFilter) params.client_id = clientFilter;
      if (machineFilter) params.machine_id = machineFilter;
      const res = await axios.get('http://localhost:5000/api/production/ofs', { params });
      setOfs(res.data);
      setLoaded(true);
    } catch (err) {
      console.error('Erreur lors du chargement des OFs:', err);
    }
  };

  useEffect(() => {
    fetchOfs();
    const interval = setInterval(fetchOfs, 10000);
    return () => clearInterval(interval);
  }, [clientFilter, machineFilter]);

  return (
    <div>
      <h2>Ordres de fabrication en cours</h2>
      {loaded && <p>TEST OK</p>}
      <div>
        <label>Filtrer par client:</label>
        <input value={clientFilter} onChange={e => setClientFilter(e.target.value)} />
        <label>Filtrer par machine:</label>
        <input value={machineFilter} onChange={e => setMachineFilter(e.target.value)} />
      </div>
      <table>
        <thead>
          <tr>
            <th>N° OF</th>
            <th>Client</th>
            <th>Machine</th>
            <th>Temps écoulé</th>
            <th>Temps restant</th>
            <th>État</th>
          </tr>
        </thead>
        <tbody>
          {ofs.map(of => (
            <tr key={of.numero_of}>
              <td>{of.numero_of}</td>
              <td>{of.client}</td>
              <td>{of.machine}</td>
              <td>{of.temps_ecoule}</td>
              <td>{of.temps_restant}</td>
              <td>{of.etat}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OFList;
