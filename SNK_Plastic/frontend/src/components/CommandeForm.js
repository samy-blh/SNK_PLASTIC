import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CommandeForm() {
  const [formData, setFormData] = useState({
    client_id: '',
    nouveau_client: '',
    machine_id: '',
    produit_id: '',
    cycle_sec: '',
    moule_utilise: '',
    nombre_heures: '',
    poids_piece: '',
    nb_operateurs: '',
    matiere_id: '',
    remarques: ''
  });

  const [clients, setClients] = useState([]);
  const [machines, setMachines] = useState([]);

  // 🔁 Charger les clients
  useEffect(() => {
    axios.get('http://localhost:5000/api/clients')
      .then(res => setClients(res.data))
      .catch(err => console.error('Erreur chargement clients :', err));
  }, []);

  // 🔁 Charger les machines
  useEffect(() => {
    axios.get('http://localhost:5000/api/machines')
      .then(res => setMachines(res.data))
      .catch(err => console.error('Erreur chargement machines :', err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let clientId = formData.client_id;

    try {
      if (clientId === "new" && formData.nouveau_client) {
        const res = await axios.post('http://localhost:5000/api/clients', {
          nom: formData.nouveau_client
        });
        clientId = res.data.client_id;
      }

      const commandeData = {
        ...formData,
        client_id: clientId
      };
      delete commandeData.nouveau_client;

      const response = await axios.post('http://localhost:5000/api/commandes', commandeData);
      alert(response.data.message);

      setFormData({
        client_id: '',
        nouveau_client: '',
        machine_id: '',
        produit: '',
        cycle_sec: '',
        moule_utilise: '',
        nombre_heures: '',
        poids_piece: '',
        nb_operateurs: '',
        matiere: '',
        remarques: ''
      });
    } catch (err) {
      alert("Erreur : " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Créer une commande</h2>
      <p style={{ color: 'red' }}>TEST OK</p>

      {/* Client */}
      <label>Client</label>
      <select name="client_id" value={formData.client_id} onChange={handleChange} required>
        <option value="">-- Sélectionner un client --</option>
        <option value="new">Nouveau client</option>
        {clients.map(client => (
          <option key={client.id} value={client.id}>{client.nom}</option>
        ))}
      </select>

      {formData.client_id === "new" && (
        <div>
          <label>Nom du nouveau client</label>
          <input
            type="text"
            name="nouveau_client"
            value={formData.nouveau_client}
            onChange={handleChange}
            required
          />
        </div>
      )}

      {/* Machine */}
      <label>Machine</label>
      <select name="machine_id" value={formData.machine_id} onChange={handleChange} required>
        <option value="">-- Sélectionner une machine --</option>
        {machines.map(machine => (
          <option key={machine.id} value={machine.id}>
            {machine.nom}
          </option>
        ))}
      </select>

      <label>Produit</label>
      <input type="text" name="produit" value={formData.produit_id} onChange={handleChange} />

      <label>Cycle (sec)</label>
      <input type="text" name="cycle_sec" value={formData.cycle_sec} onChange={handleChange} />

      <label>Moule utilisé</label>
      <input type="text" name="moule_utilise" value={formData.moule_utilise} onChange={handleChange} />

      <label>Nombre d’heures</label>
      <input type="text" name="nombre_heures" value={formData.nombre_heures} onChange={handleChange} />

      <label>Poids pièce</label>
      <input type="text" name="poids_piece" value={formData.poids_piece} onChange={handleChange} />

      <label>Nombre d’opérateurs</label>
      <input type="text" name="nb_operateurs" value={formData.nb_operateurs} onChange={handleChange} />

      <label>Matière</label>
      <input type="text" name="matiere" value={formData.matiere_id} onChange={handleChange} />

      <label>Remarques</label>
      <input type="text" name="remarques" value={formData.remarques} onChange={handleChange} />

      <button type="submit">Créer la commande</button>
    </form>
  );
}

export default CommandeForm;
