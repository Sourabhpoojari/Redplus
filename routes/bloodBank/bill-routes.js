const router = require('express').Router(),
	auth = require('../../middleware/bloodBankAuth'),
	billController = require('../../controllers/bloodBank-controllers/billController');

router.get('/', auth, billController.getBills);
router.get('/:id', auth, billController.getBillById);

module.exports = router;
