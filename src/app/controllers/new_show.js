'use strict';

import express from 'express';
import mongoose from 'mongoose';
import isLoggedIn from './AuthController';

const router = express.Router();
const Show = mongoose.model('Show');

router.get('/', isLoggedIn, (req, res, next) => {

    res.render('new_show', {
        page_id: 'new_show',
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    });
});

router.post('/add', (req, res, next) => {
    let data = req.body;
    let newShow = new Show(data);
    newShow.user_id = req.user._id;

    newShow.save((err) => {
        if (err) return next(err);
        return res.send('Added successfully');
    });
});

// export router
module.exports = router;
