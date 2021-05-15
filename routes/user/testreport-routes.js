const TestReportController = require('../../controllers/user-controllers/testreport-controller'),
     router = require('express').Router(),
     isDonor =  require('../../middleware/userAuth');

router.get('/',isDonor,TestReportController.getTestReport);

module.exports = router;