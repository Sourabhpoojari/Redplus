const router = require('express').Router(),
	inventoryController = require('../../controllers/bloodBank-controllers/inventoryControllers'),
	auth = require('../../middleware/bloodBankAuth'),
	inventoryUpdate = require('../../middleware/inventory');

router.get('/', auth, inventoryUpdate, inventoryController.getInventory);

module.exports = router;
