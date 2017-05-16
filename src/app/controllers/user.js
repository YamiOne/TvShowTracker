'use strict';

import express from 'express';
import passport from 'passport';

const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('login', {
        page_id: 'login',
        error: req.flash('error')[0]
    });
});

router.post('/', passport.authenticate('local-login', {
    successRedirect : '/', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash: 'Oops. Something went wrong. Email and password don’t match.'
}));

router.get('/signup', (req, res, next) => {
    res.render('signup', {
        page_id: 'signup'
    });
});

router.post('/signup/local', passport.authenticate('local-signup', {
    successRedirect : '/', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash: 'Oops. Something went wrong. Email and password don’t match.'
}));

router.post('/signup/twitter', passport.authenticate('twitter-login'));

router.get('/signup/twitter/callback', passport.authenticate('twitter-login', { 
    successRedirect : '/', // redirect to the secure profile section
    failureRedirect: '/login' 
}));

router.post('/signup/facebook', passport.authenticate('facebook-login'));

router.get('/signup/facebook/callback', passport.authenticate('facebook-login', { 
    successRedirect : '/', // redirect to the secure profile section
    failureRedirect: '/login' 
}));

router.post('/signup/google', passport.authenticate('google-login', { scope: 'https://www.googleapis.com/auth/plus.login'}));

router.get('/signup/google/callback', passport.authenticate('google-login', { 
    successRedirect : '/', // redirect to the secure profile section
    failureRedirect: '/login' 
}));

// export router
module.exports = router;
