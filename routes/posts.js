const express = require('express');
const router = express.Router();
const { postIndex, postNew, createPost } = require('../controllers/posts');

router.get('/', postIndex);

router.get('/new', postNew);

router.post('/', createPost);

module.exports = router;