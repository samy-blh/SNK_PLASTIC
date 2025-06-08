const express = require('express');
const router = express.Router();
const {
  listOFs,
  listActiveOFs,
  createOF,
  updateOF,
  getOF,
  addLog,
  getLogs,
  getGraphData,
  getFilteredLogs,
  getFilteredOFs,
  getActiveOFByMachine,
} = require('../controllers/productionController');

// Ordres de fabrication
router.get('/of', listOFs);
router.get('/of/en-cours', listActiveOFs);
router.post('/of', createOF);
router.patch('/of/:id', updateOF);
router.get('/of/:id', getOF);

// Logs de production
router.post('/logs', addLog);
router.get('/logs', getLogs);
router.get('/logs/graph', getFilteredLogs);
router.get('/ofs', getFilteredOFs);
router.get('/active-of/:machineId', getActiveOFByMachine);

module.exports = router;
