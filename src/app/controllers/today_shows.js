import express from 'express';

import Show from '../models/show';
import isLoggedIn from './AuthController';

const router = express.Router();

/*
 * Return the show if it matches the day
 */
let isToday = (day) => {
    let today = new Date().getDay() - 1;
    return parseInt(day) === parseInt(today);
};

let getTodaysShows = (req, res, next) => {
    Show.find({user_id: req.user._id})
        .then((shows) => {
            let finalResult = [];

            shows.forEach((show) => {
                if (show.days.find(isToday)) finalResult.push(show);
            });

            res.render('index', {
                title: 'Home',
                page_id: 'home',
                shows: finalResult
            });
        })
        .catch((err) => next(err));
};

router.get('/', isLoggedIn, getTodaysShows);

module.exports = router;

