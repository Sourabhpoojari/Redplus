const router = require('express').Router(),
	auth = require('../../middleware/bloodBankAuth'),
	updateInventory = require('../../middleware/inventory'),
	expiryController = require('../../controllers/bloodBank-controllers/expiryController');

router.get('/', auth, updateInventory, expiryController.getExpired);
router.delete('/:id', auth, updateInventory, expiryController.deleteExpiry);

module.exports = router;
