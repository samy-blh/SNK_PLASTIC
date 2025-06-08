import React from 'react';

function ProductionFilters({ filters, onChange }) {
  const handle = (e) => {
    onChange({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <input
        name="client"
        placeholder="Client"
        value={filters.client || ''}
        onChange={handle}
      />
      <input
        name="machine"
        placeholder="Machine"
        value={filters.machine || ''}
        onChange={handle}
      />
      <input
        type="date"
        name="date"
        value={filters.date || ''}
        onChange={handle}
      />
    </div>
  );
}

export default ProductionFilters;
