const router = require('express').Router(),
{check} = require('express-validator'),
campOrganizeController = require('../../controllers/user-controllers/organizecamp-controller'),
auth = require('../../middleware/userAuth');


router.post('/',auth,
check('campAddress','Camp Address is required!').isEmpty(),
check('campName','Camp Name is required!').isEmail(),
check('campSchedule','Shedule date is required!').not().isEmpty(),
check('capacity','Enter a valid capacity').isEmpty(),
check('community','Enter a valid community').isEmpty(),
check('organizerContactNumber','Enter a valid phone number!').isLength({min:13,max:13}).isMobilePhone(),
check('organizerName','Enter a organizerName').isEmpty(),
check('referenceId','Enter a reference id').isEmpty(),
check('sponserOrganization','Enter a sponserOrganization').isEmpty(),
// check('campLat','Lattitude value is required').isEmpty(),
// check('campLng','Longitude value is required!').isEmpty(),

campOrganizeController.campSRequest);

module.exports = router;