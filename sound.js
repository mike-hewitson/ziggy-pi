"use strict";

var winston = require('winston');

var myLogger = new winston.Logger({
    transports: [
        new winston.transports.Console({
            json: false,
            expressFormat: true,
            colorize: true
        })
    ]
});

var Sound = require('node-aplay');

// fire and forget: 
new Sound('zebra.wav').play();
