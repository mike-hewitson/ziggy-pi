var winston = require('winston');
var Sound = require('node-aplay');

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

const leftPad = require('left-pad');
var rightPad = require('right-pad');
var gpio = require('rpi-gpio');

const screenClear = Buffer.from([0xFE, 0x01]);
const cursorOff = Buffer.from([0xFE, 0x0C]);
const screenOff = Buffer.from([0xFE, 0x08]);
const backlightOff = Buffer.from([0x7C, 0x80]);
const backlightHalf = Buffer.from([0x7C, 0x8F]);

var appRouter = function(app) {

    app.get("/", function(req, res) {
        res.send("Hello World");
    });

    app.post("/transfer", function(req, res) {

        myLogger.info(req.body);
        // fire and forget: 
        new Sound('kaching.wav').play();

        var mySerial = new SerialPort('/dev/serial0', {
            baudRate: 9600
        });
        mySerial.on('open', function() {
            myLogger.info('Port opened');
            mySerial.write(screenClear);
            var amountmessage = 'Amnt' + leftPad("R " + req.body.amount.toFixed(2), 12);
            var balancemessage = 'Bal ' + leftPad("R " + req.body.balance.toFixed(2), 12);
            mySerial.write(amountmessage + balancemessage, function() {
                myLogger.info('wrote to ziggy :' + amountmessage);
                myLogger.info('wrote to ziggy :' + balancemessage);

                gpio.setup(7, gpio.DIR_OUT, write);

                function write() {
                    gpio.write(7, true, function(err) {
                        if (err) throw err;
                        myLogger.info('Written to pin 7 - on');
                        gpio.write(7, false, function(err) {
                            if (err) throw err;
                            myLogger.info('Written to pin 7 - off');
                            process.exit();
                        });
                    });
                }
            });
        });
        return res.send(req.body);
    });

    app.post("/goal", function(req, res) {

        myLogger.info(req.body);
        // fire and forget: 
        new Sound('football-crowd.wav').play();

        var mySerial = new SerialPort('/dev/serial0', {
            baudRate: 9600
        });
        mySerial.on('open', function() {
            myLogger.info('Port opened');
            mySerial.write(screenClear);
            var goalAmntMessage = 'goal' + leftPad("R " + req.body.goal.toFixed(2), 12);
            var goalMessage = rightPad("X".repeat(req.body.progress), 16);
            mySerial.write(goalAmntMessage + goalMessage, function() {
                myLogger.info('wrote to ziggy :' + goalAmntMessage);
                myLogger.info('wrote to ziggy :' + goalMessage);
                process.exit();
            });
        });
        return res.send(req.body);
    });

    app.post("/sound", function(req, res) {
        myLogger.info(req.body);
        // fire and forget: 
        new Sound(req.body.sound + '.wav').play();
        return res.send(req.body);
    });
};

module.exports = appRouter;
