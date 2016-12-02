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
        new Sound('zebra.wav').play();

        var mySerial = new SerialPort('/dev/serial0', {
            baudRate: 9600
        });
        mySerial.on('open', function() {
            myLogger.info('Port opened');
            mySerial.write(screenClear);
            var amountmessage = 'Amount : R ' + req.body.amount.format(2);
            var balancemessage = 'Balance : R ' + req.body.balance.format(2);
            mySerial.write(amountmessage);
            mySerial.write(balancemessage);
            myLogger.info('wrote to ziggy :' + amountmessage);
            myLogger.info('wrote to ziggy :' + balancemessage);
            // process.exit();
        });
        return res.send(req.body);
    });
};

module.exports = appRouter;
