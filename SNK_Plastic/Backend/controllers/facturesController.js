const pool = require('../db');

const getAllFactures = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM factures ORDER BY id');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

const getFactureById = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('SELECT * FROM factures WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Facture non trouvée' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

const generateNumeroFacture = async () => {
  const { rows } = await pool.query('SELECT numero_facture FROM factures ORDER BY id DESC LIMIT 1');
  if (rows.length === 0) {
    return 'F-001';
  }
  const match = rows[0].numero_facture.match(/F-(\d+)/);
  const next = match ? parseInt(match[1], 10) + 1 : 1;
  return `F-${String(next).padStart(3, '0')}`;
};

const createFacture = async (req, res) => {
  const { client_id, produit_id, date_emission, montant_total, montant_paye, pdf_facture } = req.body;
  try {
    const numero = await generateNumeroFacture();
    const { rows } = await pool.query(
      `INSERT INTO factures (numero_facture, client_id, produit_id, date_emission, montant_total, montant_paye, pdf_facture)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [numero, client_id, produit_id, date_emission, montant_total, montant_paye, pdf_facture || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

const updateFacture = async (req, res) => {
  const { id } = req.params;
  const { client_id, produit_id, date_emission, montant_total, montant_paye, pdf_facture } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE factures SET client_id=$1, produit_id=$2, date_emission=$3, montant_total=$4, montant_paye=$5, pdf_facture=$6 WHERE id=$7 RETURNING *`,
      [client_id, produit_id, date_emission, montant_total, montant_paye, pdf_facture || null, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Facture non trouvée' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

const deleteFacture = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM factures WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Facture non trouvée' });
    }
    res.json({ message: 'Facture supprimée' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = {
  getAllFactures,
  getFactureById,
  createFacture,
  updateFacture,
  deleteFacture,
};

