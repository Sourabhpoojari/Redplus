const router = require('express').Router(),
	requestController = require('../../controllers/admin-controllers/request-controllers'),
	isAdmin = require('../../middleware/adminAuth');

router.get(
	'/bloodBankRequests',
	isAdmin,
	requestController.getBloodBankRequest
);
router.post(
	'/bloodBankRequests/:req_id',
	isAdmin,
	requestController.acceptBloodBankRequest
);
router.get('/hospitalRequests', isAdmin, requestController.getHospitalRequest);
router.post(
	'/hospitalRequests/:req_id',
	isAdmin,
	requestController.acceptHospitalRequest
);
router.delete(
	'/bloodBankRequests/:req_id',
	isAdmin,
	requestController.rejectBloodBankRequest
);
router.delete(
	'/hospitalRequests/:req_id',
	isAdmin,
	requestController.rejecthospitalRequest
);
router.get(
	'/bloodBankRequests/:id',
	isAdmin,
	requestController.getBloodBankById
);
router.get('/hospitalRequests/:id', isAdmin, requestController.getHospitalById);
router.get(
	'/campScheduleRequests',
	isAdmin,
	requestController.getCampSheduleRequest
);
router.get(
	'/campScheduleRequests/:id',
	isAdmin,
	requestController.getCampSheduleById
);
router.post(
	'/campScheduleRequests/:req_id',
	isAdmin,
	requestController.acceptCampSheduleRequest
);
router.delete(
	'/campScheduleRequests/:req_id',
	isAdmin,
	requestController.rejectcampsheduleRequest
);

module.exports = router;
