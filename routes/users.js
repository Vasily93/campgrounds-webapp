const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const User = require('../models/user');
const passport = require('passport');

router.get('/register', (req, res) => {
    res.render('user/register')
})

router.post('/register', catchAsync(async (req, res) => {
    try{
    const {email, username, password} = req.body;
    const user = new User({ email, username});
    const newUser = await User.register(user, password);
    console.log(newUser)
    await newUser.save()
    } catch(e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
    req.flash('success', 'Welcome to CampApp!')
    res.redirect('/campgrounds')
}))

router.get('/login', (req, res) => {
    res.render('user/login')
})

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res) => {
    req.flash('success', 'welcome back!')
    res.redirect('/campgrounds')
})

router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success', 'You are logged out')
    res.redirect('/campgrounds');
})


module.exports = router; 