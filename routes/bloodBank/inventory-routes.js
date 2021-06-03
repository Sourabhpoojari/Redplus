const router = require('express').Router(),
	inventoryController = require('../../controllers/bloodBank-controllers/inventoryControllers'),
	updateInventory = require('../../middleware/inventory'),
	auth = require('../../middleware/bloodBankAuth');

router.get('/', auth, updateInventory, inventoryController.getInventory);

module.exports = router;
