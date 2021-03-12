const router = require('express').Router(),
    userControllers = require('../../controllers/user-controllers/user-controllers');


router.post('/phone',userControllers.getPhone);


module.exports = router;