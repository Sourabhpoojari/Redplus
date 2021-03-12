const User = require('../../models/user/userSchema'),
config = require('config'),
MESSAGEBIRD_API_KEY = config.get('MESSAGEBIRD_API_KEY'),
 messagebird = require('messagebird')(MESSAGEBIRD_API_KEY);



//  @route /api/phone
// @desc post user phone number
// @access Public
const getPhone = async (req,res,next) => {
    // console.log(req.body.phone);
    const {phone} = req.body;
    try {
         messagebird.verify.create(phone,{
             originator :'+919632269899',
            template:"Your verification code for Donor registration is %token."
        },(err,response) => {
            if (err) {
                console.error(err);
                return res.status(422).send("Phone number error!");
            } else {
                console.log(response);
                return res.status(200).json({id:response.id});
            }
        });
       
    } catch (err) {
        console.error(err.message);
        return res.status(500).send("Phone number error!");
    }
}


exports.getPhone = getPhone;