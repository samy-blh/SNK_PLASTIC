const express = require('express');
const router = express.Router();
const { getKpis, getActiveOFs } = require('../controllers/dashboardController');

// Les filtres sont passés via req.query :
//  client_id, machine_id, date_from, date_to
router.get('/kpis', getKpis);
router.get('/ofs', getActiveOFs);

module.exports = router;
