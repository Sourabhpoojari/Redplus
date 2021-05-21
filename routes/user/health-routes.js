const router = require('express').Router(),
	healthController = require('../../controllers/user-controllers/health-controllers'),
	auth = require('../../middleware/donorAuth');

router.post('/health/:bloodBank_id', auth, healthController.addHealthInfo);
router.get('/prevDonation', auth, healthController.getDonation);

module.exports = router;
