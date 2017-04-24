'use strict';

import express from 'express';
import mongoose from 'mongoose';
import isLoggedIn from './AuthController';

const router = express.Router();
const Show = mongoose.model('Show');

router.get('/', isLoggedIn, (req, res, next) => {
    Show.find({user_id: req.user._id}, (err, shows) => {
        if (err) return next(err);
        res.render('all_shows', {
            page_id: 'all_shows',
            shows
        });
    });
});

router.post('/delete', isLoggedIn, (req, res, next) => {
    Show.remove({_id: req.body.show_id}, (err) => {
        if (err) return next(err);
        return res.send('Removed successfully');
    });
});

// export router
module.exports = router;
