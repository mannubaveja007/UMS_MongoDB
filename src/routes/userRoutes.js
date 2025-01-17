const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // Protect all routes after this middleware

router.get('/me', userController.getProfile);
router.patch('/update', [
  body('name').optional().trim().isLength({ min: 2 }),
  body('phoneNumber').optional().matches(/\d{10}/)
], userController.updateProfile);
router.patch('/deactivate', userController.deactivateAccount);

module.exports = router;