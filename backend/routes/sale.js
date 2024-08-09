const express = require('express');
const router = express.Router();
const saleController = require('../controllers/sale');

// Get all sales
router.get('/', saleController.getAllSales);

// Get a sale by ID
router.get('/:id', saleController.getSaleById);

// Create a new sale
router.post('/', saleController.createSale);

router.post('/fetchByField',saleController.searchSales)

// Get sales by product ID
router.get('/product/:productId', saleController.getSalesByProductId);

// Get sales by customer ID
router.get('/customer/:customerId', saleController.getSalesByCustomerId);

module.exports = router;
