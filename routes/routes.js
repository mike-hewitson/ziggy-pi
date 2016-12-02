var request = require('request');
var winston = require('winston');
var Papertrail = require('winston-papertrail').Papertrail;

var myLogger = new winston.Logger({
    transports: [
        new winston.transports.Console({
            json: false,
            expressFormat: true,
            colorize: true
        })
    ]
});

var SerialPort = require('serialport');

const screenClear = Buffer.from([0xFE, 0x01]);
const cursorOff = Buffer.from([0xFE, 0x0C]);
const screenOff = Buffer.from([0xFE, 0x08]);
const backlightOff = Buffer.from([0x7C, 0x80]);
const backlightHalf = Buffer.from([0x7C, 0x8F]);

var mySerial = new SerialPort('/dev/serial0', {
    baudRate: 9600
});

var appRouter = function(app) {

    app.get("/", function(req, res) {
        res.send("Hello World");
    });

    app.post("/transfer", function(req, res) {

        myLogger.info(req.body);
        return res.send(req.body);
        mySerial.on('open', function() {
            myLogger.info('Port opened');
            mySerial.write(screenClear);
            var message = req.body.balance + " - " + req.body.amount;
            mySerial.write(message);
            myLogger.info('wrote hello ziggy');
            // process.exit();
        });
    });
};

module.exports = appRouter;
