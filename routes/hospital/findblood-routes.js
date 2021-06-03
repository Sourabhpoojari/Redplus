const findHospitalController = require('../../controllers/hospital-controllers/findblood-controller'),
	router = require('express').Router(),
	auth = require('../../middleware/hospitalAuth');


    router.get('/nearbyblooodbank',auth,findHospitalController.getnearbybloodBank);
    
    router.get('/:component/:bgroup',auth,findHospitalController.getBloodBlanks);

    router.post('/bloodRequestS/:req_id',auth,findHospitalController.bloodRequestForm);

module.exports = router;