const Admin = require('../../models/admin/adminSchema'),
	config = require('config'),
	{ validationResult } = require('express-validator'),
	bcrypt = require('bcryptjs'),
	jwt = require('jsonwebtoken');

//  @route /api/user/signup
// @desc  User sign-up && put user info
// @access Public
// const signUp = async (req,res,next) => {
//     const {email,password } = req.body;
//     let admin;
//     const errors = validationResult(req);
//     if(!errors.isEmpty()){
//         return res.status(400).json({errors:errors.array()});
//     }
//     try {
//         admin =await new Admin({
//             email,password
//         });
//         // bcrypt password
//         const salt = await bcrypt.genSalt(10);
//         admin.password = await bcrypt.hash(password,salt);
//         await admin.save();
//         // setting jwt
//         const payload = {
//             admin : {
//                 id : admin.id
//             }
//         };
//         jwt.sign(
//             payload,
//             config.get('jwtSecret'),
//             {expiresIn : 3600},
//             (err,token)=>{
//                 if(err) throw err;
//                  return res.status(200).json({token});
//             }
//         );

//     } catch (err) {
//         console.error(err.message);
//         return res.status(500).send("Server error!");
//     }
// }

//  @route /api/admin/logIn
// @desc  User login
// @access Private

const logIn = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	const { email, password } = req.body;
	let admin;
	try {
		admin = await Admin.findOne({ email });
		if (!admin) {
			return res
				.status(400)
				.json({ errors: [{ msg: 'invalid admin credentials' }] });
		}
		// check password
		const match = await bcrypt.compare(password, admin.password);
		if (!match) {
			return res
				.status(400)
				.json({ errors: [{ msg: 'invalid password credentials' }] });
		}
		// setting jwt
		const payload = {
			admin: {
				id: admin.id,
			},
		};
		jwt.sign(
			payload,
			config.get('jwtSecret'),
			{ expiresIn: '7d' },
			(err, token) => {
				if (err) throw err;
				res.status(200).json({ token });
			}
		);
	} catch (err) {
		console.log(err);
		return res.status(500).send('Server error');
	}
};

exports.logIn = logIn;
// exports.signUp = signUp;
