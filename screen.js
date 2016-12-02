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

var SerialPort = require('serialport');

const screenClear = Buffer.from([0xFE,0x01]);
const cursorOff = Buffer.from([0xFE, 0x0C]);
const screenOff = Buffer.from([0xFE, 0x08]);
const backlightOff = Buffer.from([0x7C, 0x80]);
const backlightHalf = Buffer.from([0x7C, 0x8F]);

var mySerial = new SerialPort('/dev/serial0', {
    baudRate: 9600
});

function writeAndDrain (data, callback) {
  mySerial.write(data, function () {
    mySerial.drain(callback);
  });
}

mySerial.on('open', function() {

    myLogger.info('Port opened');

    mySerial.write(screenClear)
    // mySerial.write(screenClear, function() {
    //     mySerial.write("---   wtf       ");
    // });
    // mySerial.write(backlightOff);
    // mySerial.write(backlightHalf);
    // mySerial.write(cursorOff);
    var message = 
    mySerial.write("Hello, Ziggy1!  ");
    mySerial.write("--     1        ");
    // mySerial.write("--     2        ");
    myLogger.info('wrote hello ziggy');
    // process.exit();
});

// open errors will be emitted as an error event
mySerial.on('error', function(err) {
    myLogger.error('Error: ', err.message);
    process.exit(1);
})
    // mySerial.write("--     3        ");
