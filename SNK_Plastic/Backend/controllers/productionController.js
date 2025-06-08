const pool = require('../db');

// Get list of active manufacturing orders
const getOFs = async (req, res) => {
  try {
    const query = `SELECT of.id AS numero_of, c.nom AS client, m.nom AS machine,
                          of.temps_ecoule, of.temps_restant, of.etat
                   FROM ordres_fabrication of
                   JOIN clients c ON of.client_id = c.id
                   JOIN machines m ON of.machine_id = m.id
                   WHERE of.etat != 'termine'`;
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des OFs:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Get production logs with optional filters
const getLogs = async (req, res) => {
  const { machine_id, client_id, date } = req.query;
  const conditions = [];
  const values = [];
  let idx = 1;
  let query = `SELECT pl.*, c.nom AS client, m.nom AS machine
               FROM production_logs pl
               JOIN ordres_fabrication of ON pl.of_id = of.id
               JOIN clients c ON of.client_id = c.id
               JOIN machines m ON pl.machine_id = m.id`;

  if (machine_id) {
    conditions.push(`pl.machine_id = $${idx++}`);
    values.push(machine_id);
  }
  if (client_id) {
    conditions.push(`of.client_id = $${idx++}`);
    values.push(client_id);
  }
  if (date) {
    conditions.push(`CAST(pl.date_heure AS DATE) = $${idx++}`);
    values.push(date);
  }
  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }
  query += ' ORDER BY pl.date_heure DESC';

  try {
    const { rows } = await pool.query(query, values);
    res.json(rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des logs:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Get aggregated stats for graphs
const getStats = async (req, res) => {
  try {
    const query = `SELECT CAST(pl.date_heure AS DATE) AS jour,
                          SUM(pl.quantite_produite) AS quantite_produite,
                          SUM(pl.quantite_rebuts) AS quantite_rebuts
                   FROM production_logs pl
                   GROUP BY jour
                   ORDER BY jour`;
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des stats:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Mark a manufacturing order as started
const startOF = async (req, res) => {
  const { of_id } = req.body;
  try {
    await pool.query(
      'UPDATE ordres_fabrication SET temps_ecoule = 0, etat = $1 WHERE id = $2',
      ['En cours', of_id]
    );
    res.json({ message: 'OF démarré' });
  } catch (error) {
    console.error('Erreur lors du démarrage de l\'OF:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Update manufacturing progress
const updateOF = async (req, res) => {
  const {
    of_id,
    machine_id,
    temps_ecoule,
    temps_restant,
    quantite_produite,
    quantite_rebuts,
  } = req.body;

  try {
    await pool.query(
      'UPDATE ordres_fabrication SET temps_ecoule = $1, temps_restant = $2 WHERE id = $3',
      [temps_ecoule, temps_restant, of_id]
    );

    await pool.query(
      'INSERT INTO production_logs(of_id, machine_id, quantite_produite, quantite_rebuts) VALUES($1,$2,$3,$4)',
      [of_id, machine_id, quantite_produite, quantite_rebuts]
    );

    res.json({ message: 'OF mis à jour' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'OF:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Add rejects entry
const addRebuts = async (req, res) => {
  const { of_id, machine_id, quantite_rebuts } = req.body;
  try {
    await pool.query(
      'INSERT INTO production_logs(of_id, machine_id, quantite_produite, quantite_rebuts) VALUES ($1, $2, $3, $4)',
      [of_id, machine_id, 0, quantite_rebuts]
    );
    res.status(201).json({ message: 'Rebuts ajoutés' });
  } catch (error) {
    console.error('Erreur lors de l\'ajout des rebuts:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = {
  getOFs,
  getLogs,
  getStats,
  startOF,
  updateOF,
  addRebuts,
};
