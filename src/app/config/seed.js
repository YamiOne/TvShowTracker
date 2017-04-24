/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

import User from '../models/user';

const newUser = new User();

User.find().remove();

console.log('============== REMOVED ALL USERS ==============');

newUser.local.email    = 'admin@email.com';
newUser.local.password = newUser.generateHash('0000');

// save the user
newUser.save((err) => {
    if (err) throw err;
});

console.log('============== SAVED ADMIN USER ==============');
