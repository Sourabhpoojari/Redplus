const router = require('express').Router(),
	requestController = require('../../controllers/bloodBank-controllers/request-controllers'),
	updateInventory = require('../../middleware/inventory'),
	isBloodBank = require('../../middleware/bloodBankAuth');

router.get('/donorRequests', isBloodBank, requestController.getDonorRequests);
router.get(
	'/donorRequests/:req_id',
	isBloodBank,
	requestController.getDonorById
);

router.post(
	'/acceptDonorRequest/:req_id',
	isBloodBank,
	requestController.acceptdonorRequest
);
router.delete(
	'/rejectDonorRequest/:req_id',
	isBloodBank,
	requestController.rejectDonorRequest
);

router.get('/bloodRequests', isBloodBank, requestController.getBloodRequests);
router.get(
	'/bloodRequests/:req_id',
	isBloodBank,
	requestController.getBloodRequestById
);
router.post(
	'/acceptBloodRequest/:req_id',
	isBloodBank,
	updateInventory,
	requestController.acceptBloodRequest
);
router.delete(
	'/rejectBloodRequest/:req_id',
	isBloodBank,
	requestController.rejectBloodRequest
);

module.exports = router;
