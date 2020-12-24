module.exports.isLoggedIn = (req, res, next) => {
    console.log(req.user)
    if(!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'you are not logged in!');
        return res.redirect('/login');
    }
    next()
}