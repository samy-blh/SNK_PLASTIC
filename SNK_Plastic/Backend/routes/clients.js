const express = require('express');
const router = express.Router();
const pool = require('../db');

// Route POST /api/clients
router.post('/', async (req, res) => {
  const { nom } = req.body;

  if (!nom) {
    return res.status(400).json({ error: 'Le nom du client est requis' });
  }

  try {
    // Insertion du nouveau client
    const result = await pool.query(
      'INSERT INTO clients (nom) VALUES ($1) RETURNING id',
      [nom]
    );

    const newClientId = result.rows[0].id;
    res.status(201).json({ message: 'Client créé avec succès', client_id: newClientId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur lors de la création du client' });
  }
});

module.exports = router;
