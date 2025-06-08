const express = require('express');
const router = express.Router();
const {
  getAllFactures,
  getFactureById,
  createFacture,
  updateFacture,
  deleteFacture,
} = require('../controllers/facturesController');

router.get('/', getAllFactures);
router.get('/:id', getFactureById);
router.post('/', createFacture);
router.put('/:id', updateFacture);
router.delete('/:id', deleteFacture);

module.exports = router;
