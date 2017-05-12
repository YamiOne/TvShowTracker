/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

import User from '../models/user';

User.remove({})
    .then(() => {
        console.log('----> REMOVED ALL USERS');
    })
    .catch(err => console.error(err));