'use strict';

import express from 'express';
import passport from 'passport';

const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('login', {
        page_id: 'login'
    });
});

router.get('/:reg', (req, res, next) => {
    res.render('signup', {
        page_id: 'signup'
    });
});

// process the login form
router.post('/', passport.authenticate('local-login', {
    successRedirect : '/', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));

// export router
module.exports = router;
