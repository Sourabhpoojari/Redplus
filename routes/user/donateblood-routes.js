const BloodbankInfo = require('../../controllers/user-controllers/donateblood-controllers'),
router= require('express').Router(),
{check}= require('express-validator'),
    auth = require('../../middleware/userAuth');

router.post('/donateblood',auth,check('lat','Please Give Latitude value').exists(),
check('lang','Please Give Langitude value ').exists(),BloodbankInfo.bloodbankinfo);

router.get('/donateblood/:id',auth,BloodbankInfo.getBloodBankById);

module.exports = router;

