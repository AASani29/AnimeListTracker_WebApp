const express = require('express');
const path = require('path');
const router = express.Router();
const authController = require('../controller/auth.controller.js'); 

router.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '../html_files/signup.html')); 
});

router.post('/signup', authController.signup);


router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../html_files/login.html')); 
});

router.post('/login', authController.login);


module.exports = router;
