'use strict';

import express from 'express';

import UserController from './user';
import NewShowController from './new_show';
import AllShowsController from './all_shows';
import TodayShowsController from './today_shows';

// create router
const router = express.Router();

// Private routes - should be checked if user logged in
router.use('/all_shows', AllShowsController);
router.use('/new_show', NewShowController);

// set basic routes
router.get('/', TodayShowsController);

// Public routes
router.use('/login', UserController);
router.get(['/signup', '/signup/twitter/callback', '/signup/facebook/callback', '/signup/google/callback'], UserController);
router.post('/signup/:type', UserController);

// LOGOUT
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

module.exports = router;
