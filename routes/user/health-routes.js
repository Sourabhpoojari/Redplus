const router = require('express').Router(),
	healthController = require('../../controllers/user-controllers/health-controllers'),
	auth = require('../../middleware/donorAuth');

router.post('/:bloodBank_id', auth, healthController.addHealthInfo);
router.post('/:camp_id/:bloodBank_id', auth, healthController.campHealthInfo);
router.get('/prevDonation', auth, healthController.getDonation);

module.exports = router;
