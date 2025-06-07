const express = require('express');
const router = express.Router();
const {
  getAllStocks,
  addStock,
  updateStock,
  deleteStock,
} = require('../controllers/stocksController');

// GET /api/stocks
router.get('/', getAllStocks);

// POST /api/stocks
router.post('/', addStock);

// PUT /api/stocks/:id
router.put('/:id', updateStock);

// DELETE /api/stocks/:id
router.delete('/:id', deleteStock);

module.exports = router;
