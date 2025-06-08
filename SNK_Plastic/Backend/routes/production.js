const express = require('express');
const router = express.Router();
const {
  getOFs,
  getLogs,
  getStats,
  startOF,
  updateOF,
  addRebuts,
} = require('../controllers/productionController');

router.get('/ofs', getOFs);
router.get('/logs', getLogs);
router.get('/stats', getStats);
router.post('/start', startOF);
router.put('/update', updateOF);
router.post('/rebuts', addRebuts);

module.exports = router;
