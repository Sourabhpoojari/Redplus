const TestReportController = require('../../controllers/user-controllers/donation-controller'),
     router = require('express').Router(),
     isDonor =  require('../../middleware/userAuth');

router.get('/',isDonor,TestReportController.getDonations);
router.get('/:donation_id',isDonor,TestReportController.getDonationsById);

module.exports = router;