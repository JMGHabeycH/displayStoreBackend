const express = require('express');
const router = express.Router();
const upload = require('../multer/multer');

const {createProduct, getProductById, getProductsWithFilter, rateProduct} = require("../controllers/products");

router.get('/', getProductsWithFilter);

router.post('/create', upload.single('image'), createProduct);

router.post('/rate/:productId', rateProduct);

router.get('/:productId', getProductById);

module.exports = router;