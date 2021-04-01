const router = require('express').Router(),
    profileControllers = require('../../controllers/user-controllers/profile-controllers'),
    multer = require('multer'),
    path = require('path'),
    isLogin = require('../../middleware/userAuth'),
    {check} = require('express-validator');
    auth = require('../../middleware/userAuth');

    //get profile 

    router.get('/',auth,profileControllers.getProfile);
// Set The Storage Engine
const storage = multer.diskStorage({
    filename: (req, file, cb) => {
      cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });

  // Init Upload
const upload = multer({
    storage: storage,
    limits:{fileSize: 1000000},
    fileFilter: (req, file, cb) => {
      checkFileType(file, cb);
    }
  });

  // Check File Type
function checkFileType(file, cb){
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
  
    if(mimetype && extname){
      return cb(null,true);
    } else {
      cb('Error: Images Only!');
    }
  }


  router.put('/',isLogin,[auth,[check('name','Name is required').not().isEmpty(),
  check('fatherName','Father name is required').not().isEmpty(),
  check('email','Enter a valid Email address').isEmail(),
  check('address','Address is required').exists(),
  check('gender','Gender is required').exists(),
  check('dateOfBirth','Date Of Birth is required').exists().isDate(),
  check('aadhaar','Enter a valid number').isLength({min:12}),
  check('bloodGroup','Blood Group is required').exists()]],upload.single('profileImage'),profileControllers.createProfile);





module.exports = router;