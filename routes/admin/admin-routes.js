const router = require('express').Router(),
	admincontroller = require('../../controllers/admin-controllers/admin-controllers'),
	{ check } = require('express-validator'),
	isAdmin = require('../../middleware/adminAuth');

router.post(
	'/logIn',
	check('email', 'Admin email is required').isEmail(),
	check('password', 'Password is required').isLength({ min: 6 }),
	admincontroller.logIn
);

// router.post('/signUp',admincontroller.signUp);
router.get('/dashboard', isAdmin, admincontroller.getDashBoard);
module.exports = router;
