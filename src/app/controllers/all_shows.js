'use strict';

import express from 'express';

import isLoggedIn from './AuthController';
import Show from '../models/show';

const router = express.Router();

const WEEK_DAYS = {
    0: 'Monday',
    1: 'Tuesday',
    2: 'Wednesday',
    3: 'Thursday',
    4: 'Friday',
    5: 'Saturday',
    6: 'Sunday'
};

let getShowsByDay = (user_id) => {
    let groupedShows = [];

    /**
     * NOTE: need to rewrite this
     */
    return new Promise((resolve, reject) => {
        for (let i = 0; i < 7; i++){
            Show.find({user_id: user_id, days: { $in: [i.toString()]}})
                .then((shows) => {
                    if (shows.length) {
                        groupedShows.push({
                            day_index: i,
                            day_name: WEEK_DAYS[i],
                            shows: shows
                        });
                    }

                    if (i === 6) resolve(groupedShows);
                })
                .catch((err) => {
                    console.log(`catching err ${err}`);
                    groupedShows = [];
                });
        } 
    });
};

router.get('/', isLoggedIn, (req, res, next) => {
    let groupedShows = [];
    getShowsByDay(req.user._id)
        .then((result) => {
            groupedShows = result.sort((a, b) => a.day_index - b.day_index );
            res.render('all_shows', {
                page_id: 'all_shows',
                groupedShows,
                WEEK_DAYS
            });
        })
        .catch((err) => {
            res.render('all_shows', {
                page_id: 'all_shows',
                groupedShows,
                WEEK_DAYS
            });
        });
});

router.post('/delete', isLoggedIn, (req, res, next) => {
    Show.remove({_id: req.body.show_id}, (err) => {
        if (err) return next(err);
        return res.send('Removed successfully');
    });
});

router.post('/edit', isLoggedIn, (req, res, next) => {
    Show.findById(req.body.show_id)
        .then((show) => {
            show.title = req.body.show_title;
            show.days.splice(show.days.indexOf(req.body.current_day), 1);
            show.days.push(req.body.show_day);

            console.log(show);
            show.save()
                .then(() => res.json(show))
                .catch((err) => next(err));
        })
        .catch((err) => next(err));
});

// export router
module.exports = router;
