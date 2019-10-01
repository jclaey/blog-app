const express = require('express');
const router = express.Router();
const { 
    productIndex,
    productNew,
    productCreate,
    productShow,
    addToCart
 } = require('../controllers/products');

router.get('/', productIndex);

router.get('/new', productNew);

router.post('/', productCreate);

router.get('/:id', productShow);

router.get('/:id/cart', addToCart);

router.get('/cart');

// router.post('/charge', stripeCheckout);

module.exports = router;