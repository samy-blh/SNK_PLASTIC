import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ProductionFilters({ onFilterChange }) {
  const [clients, setClients] = useState([]);
  const [machines, setMachines] = useState([]);
  const [filters, setFilters] = useState({
    client_id: '',
    machine_id: '',
    date_from: '',
    date_to: '',
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [cRes, mRes] = await Promise.all([
          axios.get('http://localhost:5000/api/clients'),
          axios.get('http://localhost:5000/api/machines'),
        ]);
        setClients(cRes.data);
        setMachines(mRes.data);
      } catch (err) {
        console.error('Erreur chargement filtres:', err);
      }
    };
    load();
  }, []);

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((f) => ({ ...f, [name]: value }));
  };

  return (
    <div>
      <select name="client_id" value={filters.client_id} onChange={handleChange}>
        <option value="">Tous les clients</option>
        {clients.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nom}
          </option>
        ))}
      </select>
      <select name="machine_id" value={filters.machine_id} onChange={handleChange}>
        <option value="">Toutes les machines</option>
        {machines.map((m) => (
          <option key={m.id} value={m.id}>
            {m.nom}
          </option>
        ))}
      </select>
      <input
        type="date"
        name="date_from"
        value={filters.date_from}
        onChange={handleChange}
      />
      <input
        type="date"
        name="date_to"
        value={filters.date_to}
        onChange={handleChange}
      />
    </div>
  );
}

export default ProductionFilters;
