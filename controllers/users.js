const User = require('../models/user');

module.exports.renderRegisterForm = (req, res) => {
    res.render('user/register')
}

module.exports.register = async (req, res, next) => {
    try{
    const {email, username, password} = req.body;
    const user = new User({ email, username});
    const newUser = await User.register(user, password);
    await newUser.save();
    req.login(newUser, err => {
        if(err) return next(err);
        req.flash('success', 'Welcome to CampApp!')
    res.redirect('/campgrounds')
    })
    } catch(e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
}

module.exports.renderLogin =  (req, res) => {
    res.render('user/login')
}

module.exports.login = (req, res) => {
    req.flash('success', 'welcome back!');
    const redirect = req.session.returnTo || '/campgrounds';
    res.redirect(redirect)
}

module.exports.logout = (req, res) => {
    req.logOut();
    req.flash('success', 'You are logged out')
    res.redirect('/campgrounds');
}