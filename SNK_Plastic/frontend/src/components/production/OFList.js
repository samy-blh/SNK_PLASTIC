import React, { useEffect, useState } from 'react';
import axios from 'axios';
import OFCard from './OFCard';

function OFList({ filters }) {
  const [ofs, setOfs] = useState([]);

  const fetchOfs = async () => {
    try {
      const params = {};
      if (filters.client) params.client = filters.client;
      if (filters.machine) params.machine = filters.machine;
      const res = await axios.get('http://localhost:5000/api/production/of/en-cours', { params });
      setOfs(res.data);
    } catch (err) {
      console.error('Erreur chargement OFs:', err);
    }
  };

  useEffect(() => {
    fetchOfs();
  }, [filters]);

  return (
    <div>
      <h2>OF en cours</h2>
      <div className="of-list">
        {ofs.map((of) => (
          <OFCard key={of.id} of={of} onFinish={fetchOfs} />
        ))}
      </div>
    </div>
  );
}

export default OFList;
