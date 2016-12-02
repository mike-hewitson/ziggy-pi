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
            var line1 = rightPad(req.body.description, 12);
            var line2 = 'Amnt' + leftPad("R " + req.body.amount.toFixed(2), 12);
            var line3 = 'Bal ' + leftPad("R " + req.body.balance.toFixed(2), 12);
            var line4 = "I" + rightPad("-".repeat(req.body.progress) + ">", 14) + "I";
            mySerial.write(line1 + line2, function() {
                myLogger.info(new Date());
                myLogger.info('wrote to ziggy :' + line1);
                myLogger.info('wrote to ziggy :' + line2);
                setTimeout(function() {
                    mySerial.write(line3 + line4, function() {
                        new Sound('football-crowd.wav').play();
                        myLogger.info(new Date());
                        myLogger.info('wrote to ziggy :' + line3);
                        myLogger.info('wrote to ziggy :' + line4);
                        process.exit();
                    });
                }, 10000);
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
