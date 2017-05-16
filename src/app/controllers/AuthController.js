'use strict';

module.exports = function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated() === true)
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
};
