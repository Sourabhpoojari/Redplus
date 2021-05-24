const router = require('express').Router(),
    pricingController = require('../../controllers/bloodBank-controllers/pricingControllers'),
    isBloodBank = require('../../middleware/bloodBankAuth');

    router.get('/getPricing',isBloodBank,pricingController.getPricing);
    router.post('/createandupdatePricing',isBloodBank,pricingController.createandupdatePricing);

module.exports = router;