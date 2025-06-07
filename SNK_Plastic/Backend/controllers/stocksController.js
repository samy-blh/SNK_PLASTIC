const pool = require('../db');

// Controller for retrieving stocks with optional filters
const getAllStocks = async (req, res) => {
  const { type, client_id } = req.query;
  const conditions = [];
  const values = [];

  // Add filtering by type_objet
  if (type) {
    conditions.push(`type_objet = $${conditions.length + 1}`);
    values.push(type);
  }

  // Add filtering by client_id
  if (client_id) {
    conditions.push(`client_id = $${conditions.length + 1}`);
    values.push(client_id);
  }

  // Build the SQL query
  let query = 'SELECT * FROM stock';
  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  try {
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des stocks:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Controller for adding a stock entry
const addStock = async (req, res) => {
  const {
    nom_objet,
    type_objet,
    client_id,
    quantite,
    date_entree,
    echeance_stock,
  } = req.body;

  try {
    const query = `INSERT INTO stock (
      nom_objet,
      type_objet,
      client_id,
      quantite,
      date_entree,
      echeance_stock
    ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;

    const values = [
      nom_objet,
      type_objet,
      client_id,
      quantite,
      date_entree,
      echeance_stock,
    ];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de l\'ajout du stock:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Controller for updating a stock entry
const updateStock = async (req, res) => {
  const { id } = req.params;
  const {
    nom_objet,
    type_objet,
    client_id,
    quantite,
    date_entree,
    echeance_stock,
  } = req.body;

  try {
    const query = `UPDATE stock SET
      nom_objet = $1,
      type_objet = $2,
      client_id = $3,
      quantite = $4,
      date_entree = $5,
      echeance_stock = $6
    WHERE id = $7 RETURNING *`;

    const values = [
      nom_objet,
      type_objet,
      client_id,
      quantite,
      date_entree,
      echeance_stock,
      id,
    ];

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Stock non trouvé' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du stock:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Controller for deleting a stock entry
const deleteStock = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM stock WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Stock non trouvé' });
    }
    res.json({ message: 'Stock supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du stock:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = {
  getAllStocks,
  addStock,
  updateStock,
  deleteStock,
};

