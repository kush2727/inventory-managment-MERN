const express = require('express');
const router = express.Router();
const productController = require('../controllers/product');
const upload = require('../storage/multer');

// Get all products
router.get('/', productController.getProducts);

// Get a product by ID
router.get('/:id', productController.getProductById);

// Create a new product
router.post('/',upload.single('image'), productController.createProduct);

// Update a product by ID
router.put('/:id', upload.single('image'), productController.updateProductById);

// Delete a product by ID
router.delete('/:id', productController.deleteProductById);

module.exports = router;

