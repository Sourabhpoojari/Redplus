const router = require('express').Router(),
	auth = require('../../middleware/bloodBankAuth'),
	updateInventory = require('../../middleware/inventory'),
	componentController = require('../../controllers/bloodBank-controllers/componentController');

router.get(
	'/:component/:bgroup',
	auth,
	updateInventory,
	componentController.getComponents
);

module.exports = router;
