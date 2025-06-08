import React, { useEffect, useState } from 'react';
import axios from 'axios';
import OFCard from './OFCard';

function OFList({ filters }) {
  const [ofs, setOfs] = useState([]);

  const fetchOfs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/production/ofs', {
        params: filters,
      });
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
