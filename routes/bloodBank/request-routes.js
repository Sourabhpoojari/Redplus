const router = require('express').Router(),
    requestController = require('../../controllers/bloodBank-controllers/request-controllers'),
    isBloodBank = require('../../middleware/bloodBankAuth');

router.get('/donorRequests',isBloodBank,requestController.getDonorRequests);
router.get('/donorRequests/:id',isBloodBank,requestController.getDonorById);

router.post('/acceptDonorRequest/:id',isBloodBank,requestController.acceptdonorRequest);
router.delete('/rejectDonorRequest/:id',isBloodBank,requestController.rejectDonorRequest);

module.exports = router;