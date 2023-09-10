const SerialPort = require('serialport');

const serialPort = new SerialPort.SerialPort({
	path: '/dev/tty.usbserial-21130', // my orb is plugged into a USB->serial cable
	baudRate: 19200
});

/**
 * function that packs a color code and an animation type into a string message
 * that the ambient orb will render. I dont have a copy of the developer docs.
 * This is based on looking at other peoples code that I found. A color/animation
 * message starts with ~A and then has two bytes, determined by the algorithm you
 * can see below.
 * Color is between 0 and 36 inclusive. Animation is between 0 and 9
 */
const orbMessage = function(color,animation) {

	var byte1 = ( (color + ( 37 * animation)) / 94 ) + 32;
	byte1 = Math.floor(byte1);

	let byte2 = ( (color + ( 37 * animation)) % 94 ) + 32 ;

	return "~A"+String.fromCharCode(byte1)+String.fromCharCode(byte2);
}

// global vars lol.
let color = 0;
let animation = 0;

// increments the color and animation and sends a message to the Orb
const setNewStatus = function() {

	serialPort.write(orbMessage(color,animation));

	console.log("color="+color+" animation="+animation);

	color++;
	if (color>36) {
		color = 0;
		animation++;
	}
}

// call the function repeatedly, every 30 seconds, until done
const intervalId = setInterval(() => {
	setNewStatus();

	if (animation > 9) {
		clearInterval(intervalId);
	}
}, 30000); // 30 seconds
