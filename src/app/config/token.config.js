const config = {
    local: {
        facebook: {
            id: '1471797189509155',
            secret: '2fa7fdd990d98ed47f5ec26c4dfbd57b',
            callback: 'http://localhost:5000/signup/facebook/callback'
        },
        twitter: {
            id: 'cxmpdtErgn9E0d56t5lTDB7Jd',
            secret: 'g1i0VErVyll7mLJIlJjLgoJrA8ZNRdbNkQh5dw5ApXZvFA2uz6',
            callback: 'http://127.0.0.1:5000/signup/twitter/callback'
        },
        google: {
            id: '793021710455-iqa4cc1pneucf2kop95ao36tavceqrka.apps.googleusercontent.com',
            secret: 'zEG1_zTAsJFtIMYL6jgVdarj',
            callback: 'http://localhost:5000/signup/google/callback'
        }
    },
    production: {
        facebook: {
            id: '1474606072561600',
            secret: 'e5d61ca129e809f89902594faeab0d4e',
            callback: 'http://mydevzone.com:5000/signup/facebook/callback'
        },
        twitter: {
            id: 'JIqpZiXoXAZv5a6n74TB1njF2 ',
            secret: 'NBO5yspkdFXsKxefFMcB2YYpFITAlk1F5qpDo8sCKGiLQBBGrX',
            callback: '	http://mydevzone.com:5000/signup/twitter/callback'
        },
        google: {
            id: '793021710455-iqa4cc1pneucf2kop95ao36tavceqrka.apps.googleusercontent.com',
            secret: 'zEG1_zTAsJFtIMYL6jgVdarj',
            callback: 'http://mydevzone.com:5000/signup/google/callback'
        }
    }
};

module.exports = process.env.NODE_ENV === 'development' ? config.local : config.production;