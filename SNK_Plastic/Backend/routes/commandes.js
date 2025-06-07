const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST /api/commandes
router.post('/', async (req, res) => {
  const {
    client_id,
    machine_id,
    produit,
    cycle_sec,
    moule_utilise,
    nombre_heures,
    poids_piece,
    nb_operateurs,
    matiere,
    remarques
  } = req.body;

  try {
    await pool.query(
      `INSERT INTO commandes (
        client_id,
        machine_id,
        produit_id,
        cycle_sec,
        moule_utilise,
        nombre_heures,
        poids_piece,
        nb_operateurs,
        matiere_id,
        remarques
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        client_id,
        machine_id,
        produit,
        cycle_sec,
        moule_utilise,
        nombre_heures,
        poids_piece,
        nb_operateurs,
        matiere,
        remarques
      ]
    );
    res.status(200).json({ message: 'Commande ajoutée avec succès' });
  } catch (error) {
    console.error('Erreur lors de l’ajout de la commande :', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
