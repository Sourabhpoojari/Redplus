const router = require('express').Router(),
    requestController = require('../../controllers/bloodBank-controllers/request-controllers'),
    isBloodBank = require('../../middleware/bloodBankAuth');

router.get('/donorRequests',isBloodBank,requestController.getDonorRequests);


module.exports = router;