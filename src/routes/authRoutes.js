const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', [
  body('name').trim().isLength({ min: 2 }),
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  body('phoneNumber').matches(/\d{10}/)
], authController.register);

router.post('/login', [
  body('email').isEmail(),
  body('password').exists()
], authController.login);

module.exports = router;