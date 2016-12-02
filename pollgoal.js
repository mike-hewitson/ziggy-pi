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

var url = 'http://192.168.0.xxx:3000/abcd';

var balance = {
    read: function() {

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



                
                setTimeout(function() {
                    balance.read();
                }, 3000);
                process.exit();
            } else {
                myLogger.error(error);
                myLogger.error(response.statusCode);
                myLogger.error(body);
                process.exit(1);
            }
        });
    }
};

balance.read();
