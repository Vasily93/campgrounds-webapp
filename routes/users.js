const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const User = require('../models/user');
const passport = require('passport');
const {renderRegisterForm,
    register,
    renderLogin,
    login,
    logout
} = require('../controllers/users');

router.route('/register')
    .get(renderRegisterForm)
    .post(catchAsync(register));

router.route('/login')
    .get(renderLogin)
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), login)

router.get('/logout', logout)


module.exports = router; 