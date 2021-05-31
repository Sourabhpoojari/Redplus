const { check } = require('express-validator');
router = require('express').Router(),
PosterController = require('../../controllers/admin-controllers/post-controllers'),
isAdmin = require('../../middleware/adminAuth');

router.post('/uploadposter',isAdmin,
check('description','Description Is required').exists(),
check('poster','Poster is required').exists(),
PosterController.uploadPoster);

router.get('/getposters',isAdmin,PosterController.getPoster);

router.delete('/deleteposter/:post_id',isAdmin,PosterController.deletePoster);

module.exports = router;