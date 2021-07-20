const fast2sms = require('fast-two-sms');

const options = {
	authorization:
		'cPziVu4sAdfIwCq3GnpvEJ5X1O8WQgtZrSa2KBRTUol97myHYbuAhEte2rM5oRcHwOFfIi08Lv9p6Sbq',
	message: 'RedPlus message',
	numbers: [9741925186],
};

fast2sms
	.sendMessage(options)
	.then((resmes) => {
		console.log(resmes);
	})
	.catch((err) => {
		console.log(err);
	});
