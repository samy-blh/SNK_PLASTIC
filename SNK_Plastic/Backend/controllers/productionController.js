const pool = require('../db');

const calculateTimes = async (ofId) => {
  try {
    const logRes = await pool.query(
      `SELECT MIN(date_heure) AS debut, MAX(date_heure) AS fin,
              SUM(quantite_produite) AS qte
       FROM production_logs WHERE of_id = $1`,
      [ofId]
    );
    const log = logRes.rows[0];
    const ofRes = await pool.query('SELECT quantite_commande FROM ordres_fabrication WHERE id = $1', [ofId]);
    if (ofRes.rowCount === 0) return;
    const qteCmd = ofRes.rows[0].quantite_commande;
    let tempsEcoule = 0;
    let tempsRestant = 0;
    if (log.debut && log.fin) {
      tempsEcoule = (new Date(log.fin) - new Date(log.debut)) / 3600000;
      const progress = log.qte / qteCmd;
      if (progress > 0) {
        const total = tempsEcoule / progress;
        tempsRestant = Math.max(total - tempsEcoule, 0);
      }
    }
    await pool.query(
      'UPDATE ordres_fabrication SET temps_ecoule = $1, temps_restant = $2 WHERE id = $3',
      [tempsEcoule, tempsRestant, ofId]
    );
  } catch (e) {
    console.error('Erreur calcul temps:', e);
  }
};

// Liste de tous les OF
const listOFs = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT of.id, c.nom AS client, m.nom AS machine,
              of.temps_ecoule, of.temps_restant, of.etat
       FROM ordres_fabrication of
       JOIN clients c ON of.client_id = c.id
       JOIN machines m ON of.machine_id = m.id`
    );
    res.json(rows);
  } catch (err) {
    console.error('Erreur listOFs:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Liste des OF en cours
const listActiveOFs = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT of.id, c.nom AS client, m.nom AS machine,
              of.temps_ecoule, of.temps_restant, of.etat
       FROM ordres_fabrication of
       JOIN clients c ON of.client_id = c.id
       JOIN machines m ON of.machine_id = m.id
       WHERE of.etat != 'termine'`
    );
    res.json(rows);
  } catch (err) {
    console.error('Erreur listActiveOFs:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Création d'un OF
const createOF = async (req, res) => {
  const { client_id, machine_id, produit_id, matiere_id, quantite_commande } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO ordres_fabrication (client_id, machine_id, produit_id, matiere_id, quantite_commande, etat, temps_ecoule, temps_restant)
       VALUES ($1,$2,$3,$4,$5,'en_attente',0,0) RETURNING *`,
      [client_id, machine_id, produit_id, matiere_id, quantite_commande]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erreur createOF:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Mise à jour d'un OF
const updateOF = async (req, res) => {
  const { id } = req.params;
  const fields = ['etat', 'client_id', 'machine_id', 'produit_id', 'matiere_id', 'quantite_commande'];
  const updates = [];
  const values = [];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) {
      updates.push(`${f} = $${updates.length + 1}`);
      values.push(req.body[f]);
    }
  });
  if (updates.length === 0) return res.status(400).json({ error: 'Aucune donnée' });
  values.push(id);
  try {
    const result = await pool.query(`UPDATE ordres_fabrication SET ${updates.join(', ')} WHERE id = $${values.length} RETURNING *`, values);
    await calculateTimes(id);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erreur updateOF:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Détails d'un OF
const getOF = async (req, res) => {
  const { id } = req.params;
  try {
    await calculateTimes(id);
    const { rows } = await pool.query(
      `SELECT of.*, c.nom AS client, m.nom AS machine
       FROM ordres_fabrication of
       JOIN clients c ON of.client_id = c.id
       JOIN machines m ON of.machine_id = m.id
       WHERE of.id = $1`,
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'OF non trouvé' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Erreur getOF:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Ajout d'un log de production
const addLog = async (req, res) => {
  const { of_id, machine_id, quantite_produite, quantite_rebuts, date_heure } = req.body;
  try {
    await pool.query(
      `INSERT INTO production_logs(of_id, machine_id, quantite_produite, quantite_rebuts, date_heure)
       VALUES($1,$2,$3,$4,$5)`,
      [of_id, machine_id, quantite_produite, quantite_rebuts, date_heure || new Date()]
    );
    await calculateTimes(of_id);
    res.status(201).json({ message: 'Log ajouté' });
  } catch (err) {
    console.error('Erreur addLog:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Récupération des logs
const getLogs = async (req, res) => {
  const { of_id } = req.query;
  let query = 'SELECT * FROM production_logs';
  const values = [];
  if (of_id) {
    query += ' WHERE of_id = $1';
    values.push(of_id);
  }
  query += ' ORDER BY date_heure DESC';
  try {
    const { rows } = await pool.query(query, values);
    res.json(rows);
  } catch (err) {
    console.error('Erreur getLogs:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Logs filtrés pour graphes
const getFilteredLogs = async (req, res) => {
  const { client_id, machine_id, date_from, date_to } = req.query;
  const params = [client_id || null, machine_id || null, date_from || '1970-01-01', date_to || '2100-01-01'];
  try {
    const { rows } = await pool.query(
      `SELECT DATE(pl.date_heure) AS date,
              SUM(pl.quantite_produite) AS total_produite,
              SUM(pl.quantite_rebuts) AS total_rebuts
       FROM production_logs pl
       JOIN ordres_fabrication of ON of.id = pl.of_id
       WHERE ($1::int IS NULL OR of.client_id = $1)
         AND ($2::int IS NULL OR pl.machine_id = $2)
         AND pl.date_heure BETWEEN $3::date AND $4::date
       GROUP BY DATE(pl.date_heure)
       ORDER BY DATE(pl.date_heure)`,
      params
    );
    res.json(rows);
  } catch (err) {
    console.error('Erreur getFilteredLogs:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// OF filtrés selon les logs
const getFilteredOFs = async (req, res) => {
  const { client_id, machine_id, date_from, date_to } = req.query;
  const params = [client_id || null, machine_id || null, date_from || '1970-01-01', date_to || '2100-01-01'];
  try {
    const { rows } = await pool.query(
      `SELECT DISTINCT of.id, c.nom AS client, m.nom AS machine,
              of.temps_ecoule, of.temps_restant, of.etat
       FROM production_logs pl
       JOIN ordres_fabrication of ON pl.of_id = of.id
       JOIN clients c ON of.client_id = c.id
       JOIN machines m ON of.machine_id = m.id
       WHERE ($1::int IS NULL OR of.client_id = $1)
         AND ($2::int IS NULL OR of.machine_id = $2)
         AND pl.date_heure BETWEEN $3::date AND $4::date
       ORDER BY of.id`,
      params
    );
    res.json(rows);
  } catch (err) {
    console.error('Erreur getFilteredOFs:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// OF actif pour une machine donnée
const getActiveOFByMachine = async (req, res) => {
  const { machineId } = req.params;
  try {
    const { rows } = await pool.query(
      `SELECT * FROM ordres_fabrication
       WHERE machine_id = $1 AND etat != 'termine'
       ORDER BY id DESC
       LIMIT 1`,
      [machineId]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Aucun OF actif' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Erreur getActiveOFByMachine:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
// Données agrégées pour graphes
const getGraphData = async (req, res) => {
  const { filter } = req.query;
  let query;
  if (filter === 'machine') {
    query = `SELECT m.nom AS label, SUM(pl.quantite_produite) AS quantite_produite,
                    SUM(pl.quantite_rebuts) AS quantite_rebuts
             FROM production_logs pl
             JOIN machines m ON pl.machine_id = m.id
             GROUP BY m.nom ORDER BY m.nom`;
  } else {
    query = `SELECT c.nom AS label, SUM(pl.quantite_produite) AS quantite_produite,
                    SUM(pl.quantite_rebuts) AS quantite_rebuts
             FROM production_logs pl
             JOIN ordres_fabrication of ON pl.of_id = of.id
             JOIN clients c ON of.client_id = c.id
             GROUP BY c.nom ORDER BY c.nom`;
  }
  try {
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.error('Erreur getGraphData:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = {
  listOFs,
  listActiveOFs,
  createOF,
  updateOF,
  getOF,
  addLog,
  getLogs,
  getFilteredLogs,
  getFilteredOFs,
  getGraphData,
  getActiveOFByMachine,
};
