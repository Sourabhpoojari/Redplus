const router = require('express').Router(),
	inventoryController = require('../../controllers/bloodBank-controllers/inventoryControllers'),
	auth = require('../../middleware/bloodBankAuth');

router.get('/', auth, inventoryController.getInventory);

module.exports = router;
