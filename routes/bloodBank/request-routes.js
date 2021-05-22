const router = require('express').Router(),
    requestController = require('../../controllers/bloodBank-controllers/request-controllers'),
    isBloodBank = require('../../middleware/bloodBankAuth');

router.get('/donorRequests',isBloodBank,requestController.getDonorRequests);
router.get('/donorRequests/:req_id',isBloodBank,requestController.getDonorById);

router.post('/acceptDonorRequest/:req_id',isBloodBank,requestController.acceptdonorRequest);
router.delete('/rejectDonorRequest/:req_id',isBloodBank,requestController.rejectDonorRequest);

module.exports = router;