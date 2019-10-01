const express = require('express');
const router = express.Router();
const { 
    landingPage,
    getRegister,
    postRegister,
    getLogin,
    postLogin,
    getLogout,
    cartIndex
} = require('../controllers/index');

router.get('/', landingPage);

router.get('/register', getRegister);

router.post('/register', postRegister);

router.get('/login', getLogin);

router.post('/login', postLogin);

router.get('/logout', getLogout);

router.get('/my-cart', cartIndex);

module.exports = router;