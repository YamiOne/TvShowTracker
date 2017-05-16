/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

import User from '../models/user';
import Show from '../models/show';

User.remove({})
    .then(() => {
        console.log('----> REMOVED ALL USERS');
    })
    .catch(err => console.error(err));

Show.remove({})
    .then(() => {
        console.log('----> REMOVED ALL SHOWS');
    })
    .catch(err => console.error(err));