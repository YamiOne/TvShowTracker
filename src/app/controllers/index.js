'use strict';
// this controller is meant to set up routes from all other controllers
// it also sets up basic express routes

import express from 'express';
import passport from 'passport';

import UserController from './user';
import isLoggedIn from './AuthController';
import NewShowController from './new_show';
import AllShowsController from './all_shows';
import Show from '../models/show';

// create router
const router = express.Router();

// Private routes - should be checked if user logged in
router.use('/all_shows', AllShowsController);
router.use('/new_show', NewShowController);

// Public routes
router.use('/login', UserController);
router.get('/signup', UserController);

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));

// LOGOUT
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
});

/*
 * Return the show if it matches the day
 */
function isToday(day) {
    let today = new Date().getDay() - 1;
    return parseInt(day) === parseInt(today);
}

// set basic routes
router.get('/', isLoggedIn, (req, res, next) => {
    Show.find({user_id: req.user._id}, (err, shows) => {
        if (err) return next(err);

        let finalResult = [];

        shows.forEach((show) => {
            if (show.days.find(isToday)){
                finalResult.push(show);
            }
        });

        res.render('index', {
            title: 'Home',
            page_id: 'home',
            shows: finalResult
        });
    });
});

// export router
module.exports = router;
