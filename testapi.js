"use strict";

var request = require('request');
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

var url = 'https://api.dev.secure.investec.com';

myLogger.info("about to get data");

var req = {
    url: url,
    method: "GET",
    headers: {
        "content-type": "application/json"
    }
};


request(req, function(error, response, body) {
    if (!error && response.statusCode === 200) {
        myLogger.info('document read');
        myLogger.info(body);
        process.exit();
    } else {
        myLogger.error(error);
        myLogger.error(response.statusCode);
        myLogger.error(body);
        process.exit(1);
    }
});

