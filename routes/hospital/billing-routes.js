const BillingControllers= require('../../controllers/hospital-controllers/billing-controllers'),
    router = require('express').Router(),
	auth = require('../../middleware/hospitalAuth');

router.get('/getBillings',auth,BillingControllers.getHospitalBillingRequests);

module.exports=router;