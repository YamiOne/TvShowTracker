'use strict';

import path from 'path';
import bodyParser from 'body-parser';
import compress from 'compression';
import cookieParser from 'cookie-parser';
import express from 'express';
import favicon from 'serve-favicon';
import helmet from 'helmet';
import mongoose from 'mongoose';
import session from 'express-session';
import passport from 'passport';
import flash from 'connect-flash';
import Promise from "bluebird";

// BASIC CONFIG
const config = {
  // address of mongodb
  db: process.env.MONGOURI || 'mongodb://localhost:27017/test',
  // environment
  env: process.env.NODE_ENV || 'development',
  // port on which to listen
  port: 5000,
  // wther to seed the db or not
  seedDB: process.env.SEED_DB || true,
  // path to root directory of this app
  root: path.normalize(__dirname)
};

mongoose.Promise = Promise;

// EXPRESS SET-UP
// create app
const app = express();

// use jade and set views and static directories
app.set('view engine', 'jade');
app.set('views', path.join(config.root, 'app/views'));
app.use(express.static(path.join(config.root, 'static')));

//add middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// required for passport
app.use(session({ secret: 'tvshowsecret' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.use(compress());
app.use(cookieParser());
app.use(favicon(path.join(config.root, 'static/img/favicon.png')));
app.use(helmet());

require('./app/config/passport')(passport); // pass passport for configuration

// load all models
require(path.join(config.root, 'app/models'));

// load all controllers
app.use('/', require(path.join(config.root, 'app/controllers')));

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// general errors
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: config.env === 'development' ? err : {}
    });
});

// MONGOOSE SET-UP
mongoose.connect(config.db)
    .then( () => {
        console.log(`Connected to the database: 
            ${config.db}`);

        // Populate DB with sample data
        if(config.seedDB) require('./app/config/seed');
    })
    .catch(err => {
        throw new Error(`unable to connect to database at ${config.db}`);
    });

mongoose.connection.on('disconnected', (err) => {
    console.log('MongoDB event disconnected');
    console.log(err);
});

// START AND STOP
const server = app.listen(config.port, () => {
    console.log(`listening on port ${config.port}`);
});

process.on('SIGINT', () => {
    console.log('\nshutting down!');
    // db.close();
    server.close();
    process.exit();
});
