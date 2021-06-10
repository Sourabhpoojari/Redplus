const router = require('express').Router(),
	auth = require('../../middleware/hospitalAuth'),
	billController = require('../../controllers/hospital-controllers/billController');

router.get('/', auth, billController.getBills);
router.get('/:id', auth, billController.getBillById);

module.exports = router;
