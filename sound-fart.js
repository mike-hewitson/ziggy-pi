"use strict";

require('dotenv').config();
var winston = require('winston');
var Papertrail = require('winston-papertrail').Papertrail;

var myLogger = new winston.Logger({
    transports: [
        new winston.transports.Console({
            json: false,
            expressFormat: true,
            colorize: true
        }),
        new winston.transports.Papertrail({
            host: 'logs4.papertrailapp.com',
            port: 32583,
            program: 'ziggy-sound',
            colorize: true
        })
    ]
});

var Sound = require('node-aplay');

// fire and forget: 
new Sound('fart-01.wav').play();

// you can also listen for various callbacks: 
music.on('complete', function() {
    myLogger.info('Done with playback!');
    process.exit();
});
