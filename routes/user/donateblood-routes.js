const bloodDonateController = require('../../controllers/user-controllers/donateblood-controllers'),
	router = require('express').Router(),
	auth = require('../../middleware/userAuth');

router.get('/', auth, bloodDonateController.donateBloodInfo);
router.get('/:camp_id', auth, bloodDonateController.getBloodBanks);

module.exports = router;
