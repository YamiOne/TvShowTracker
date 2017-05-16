import User from '../models/user';

// load all the things we need
const LocalStrategy   = require('passport-local').Strategy;
const TwitterTokenStrategy = require('passport-twitter');
const FacebookStrategy = require('passport-facebook');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            User.findOne({ 'local.email' :  email }, function(err, user) {
                // if there are any errors, return the error
                if (err)
                    return done(err);

                // check to see if theres already a user with that email
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                } else {

                    // if there is no user with that email
                    // create the user
                    var newUser            = new User();

                    // set the user's local credentials
                    newUser.local.email    = email;
                    newUser.local.password = newUser.generateHash(password);

                    // save the user
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
        });
    }));

    // =========================================================================
   // LOCAL LOGIN =============================================================
   // =========================================================================
   // we are using named strategies since we have one for login and one for signup
   // by default, if there was no name, it would just be called 'local'

   passport.use('local-login', new LocalStrategy({
       // by default, local strategy uses username and password, we will override with email
       usernameField : 'email',
       passwordField : 'password',
       passReqToCallback : true // allows us to pass back the entire request to the callback
   },
   function(req, email, password, done) { // callback with email and password from our form

       // find a user whose email is the same as the forms email
       // we are checking to see if the user trying to login already exists
       User.findOne({ 'local.email' :  email }, function(err, user) {
           // if there are any errors, return the error before anything else
           if (err)
               return done(err);

           // if no user is found, return the message
           if (!user)
               return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

           // if the user is found but the password is wrong
           if (!user.validPassword(password))
               return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

           // all is well, return successful user
           return done(null, user);
       });

   }));

    // =========================================================================
    // TWITTER LOGIN ===========================================================
    // =========================================================================
    passport.use('twitter-login', new TwitterTokenStrategy({
            consumerKey: 'cxmpdtErgn9E0d56t5lTDB7Jd',
            consumerSecret: 'g1i0VErVyll7mLJIlJjLgoJrA8ZNRdbNkQh5dw5ApXZvFA2uz6',
            callbackURL: "http://localhost:5000/signup/twitter/callback"
        }, function(token, tokenSecret, profile, done) {
            process.nextTick(() => {
                User.findOne({ 'twitter.id': profile.id })
                    .then((user) => {
                        if (user) return done(null, user);

                        let newUser = new User();
                        newUser.twitter.id = profile.id;
                        newUser.twitter.token    = token;
                        newUser.twitter.username = profile.username;
                        newUser.twitter.displayName = profile.displayName;

                        newUser.save()
                            .then(() => done(null, newUser))
                            .catch((err) => {throw err;});
                    })
                    .catch(err => {throw err;});
            });
        }
    ));

    // =========================================================================
    // FACEBOOK LOGIN ==========================================================
    // =========================================================================
    passport.use('facebook-login', new FacebookStrategy({
            clientID: '1471797189509155',
            clientSecret: '2fa7fdd990d98ed47f5ec26c4dfbd57b',
            callbackURL: "http://localhost:5000/signup/facebook/callback"
        },
        function(accessToken, refreshToken, profile, done) {
            process.nextTick(() => {
                User.findOne({ 'facebook.id': profile.id })
                    .then(user => {
                        if (user) return done(null, user);
                        
                        let newUser = new User();
                        newUser.facebook.id = profile.id;
                        newUser.facebook.token    = accessToken;
                        newUser.facebook.username = profile.username;
                        newUser.facebook.displayName = profile.displayName;

                        newUser.save()
                            .then(() => done(null, newUser))
                            .catch((err) => {throw err;});
                    })
                    .catch(err => done(err));
            });
        }
    ));

    // =========================================================================
    // GOOGLE PLUS LOGIN =======================================================
    // =========================================================================
    passport.use('google-login', new GoogleStrategy({
            clientID:     '793021710455-iqa4cc1pneucf2kop95ao36tavceqrka.apps.googleusercontent.com',
            clientSecret: 'zEG1_zTAsJFtIMYL6jgVdarj',
            callbackURL: "http://localhost:5000/signup/google/callback",
            passReqToCallback   : true
        },
        function(request, accessToken, refreshToken, profile, done) {
            process.nextTick(() => {
                User.findOne({ 'google.id': profile.id})
                    .then(user => {
                        if (user) return done(user);

                        var newUser = new User();
                        newUser.google.id = profile.id;
                        newUser.google.token = accessToken;
                        newUser.google.name = profile.displayName;
                        newUser.save()
                            .then(() => done(null, newUser))
                            .catch((err) => {throw err;});
                    })
                    .catch(err => done(err));
            });
        }
    ));
};
