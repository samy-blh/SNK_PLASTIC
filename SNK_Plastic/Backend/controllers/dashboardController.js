const pool = require('../db');

// Récupère les indicateurs clés pour le tableau de bord avec filtres
const getKpis = async (req, res) => {
  const { client_id, machine_id, date_from, date_to } = req.query;
  const params = [
    client_id || null,
    machine_id || null,
    date_from || '1970-01-01',
    date_to || '2100-01-01',
  ];
  try {
    const totalsRes = await pool.query(
      `SELECT COALESCE(SUM(pl.quantite_produite),0) AS produits,
              COALESCE(SUM(pl.quantite_rebuts),0) AS rebuts
       FROM production_logs pl
       JOIN ordres_fabrication of ON pl.of_id = of.id
       WHERE of.etat != 'termine'
         AND ($1::int IS NULL OR of.client_id = $1)
         AND ($2::int IS NULL OR of.machine_id = $2)
         AND pl.date_heure BETWEEN $3::date AND $4::date`,
      params
    );
    const totals = totalsRes.rows[0];

    const restantRes = await pool.query(
      `SELECT COALESCE(SUM(of.quantite_commande - COALESCE(prod.qte,0)),0) AS restant
       FROM ordres_fabrication of
       LEFT JOIN (
         SELECT of_id, SUM(quantite_produite) AS qte
         FROM production_logs
         WHERE ($2::int IS NULL OR machine_id = $2)
           AND date_heure BETWEEN $3::date AND $4::date
         GROUP BY of_id
       ) prod ON prod.of_id = of.id
       WHERE of.etat != 'termine'
         AND ($1::int IS NULL OR of.client_id = $1)`,
      params
    );
    const restant = restantRes.rows[0].restant;

    res.json({
      total_produits_finis: parseInt(totals.produits, 10),
      total_rebuts: parseInt(totals.rebuts, 10),
      restant_a_produire: parseInt(restant, 10),
    });
  } catch (err) {
    console.error('Erreur getKpis:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Liste les ordres de fabrication non terminés avec statistiques et filtres
const getActiveOFs = async (req, res) => {
  const { client_id, machine_id, date_from, date_to } = req.query;
  const params = [
    client_id || null,
    machine_id || null,
    date_from || '1970-01-01',
    date_to || '2100-01-01',
  ];
  try {
    const { rows } = await pool.query(
      `SELECT of.id, c.nom AS client, m.nom AS machine,
              of.quantite_commande,
              COALESCE(prod.qte,0) AS quantite_produite,
              COALESCE(prod.rebuts,0) AS rebuts,
              (of.quantite_commande - COALESCE(prod.qte,0)) AS restant,
              of.temps_ecoule,
              of.etat
       FROM ordres_fabrication of
       JOIN clients c ON of.client_id = c.id
       JOIN machines m ON of.machine_id = m.id
       LEFT JOIN (
         SELECT of_id, SUM(quantite_produite) AS qte,
                SUM(quantite_rebuts) AS rebuts
         FROM production_logs
         WHERE ($2::int IS NULL OR machine_id = $2)
           AND date_heure BETWEEN $3::date AND $4::date
         GROUP BY of_id
       ) prod ON prod.of_id = of.id
       WHERE of.etat != 'termine'
         AND ($1::int IS NULL OR of.client_id = $1)
         AND ($2::int IS NULL OR of.machine_id = $2)
       ORDER BY of.id`,
      params
    );
    res.json(rows);
  } catch (err) {
    console.error('Erreur getActiveOFs:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = {
  getKpis,
  getActiveOFs,
};
