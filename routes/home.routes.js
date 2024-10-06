const express = require('express');
const { getHomePage, addAnime, editAnime, deleteAnime, getUserAnimes, addDescription } = require('../controller/home.controller.js');
const router = express.Router();


router.get('/home', getHomePage);
router.get('/api/user-animes', getUserAnimes);
router.post('/addAnime', addAnime);
router.post('/editAnime', editAnime);
router.post('/deleteAnime', deleteAnime);
router.post('/addDescription', addDescription);

module.exports = router;
