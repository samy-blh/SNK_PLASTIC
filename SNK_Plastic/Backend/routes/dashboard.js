const express = require('express');
const router = express.Router();
const { getKpis, getActiveOFs } = require('../controllers/dashboardController');

router.get('/kpis', getKpis);
router.get('/ofs', getActiveOFs);

module.exports = router;
