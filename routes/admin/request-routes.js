const router = require('express').Router(),
requestController = require('../../controllers/admin-controllers/request-controllers'),
isAdmin = require('../../middleware/adminAuth');


router.get('/bloodBankRequests',isAdmin,requestController.getBloodBankRequest);
router.post('/bloodBankRequests/:req_id',isAdmin,requestController.acceptBloodBankRequest);
router.delete('/bloodBankRequests/:req_id',isAdmin,requestController.rejectBloodBankRequest);


module.exports = router;