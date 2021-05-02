

const Donor = require('../../models/user/donorlocationSchema'),
Profile = require('../../models/user/userSchema'),
{validationResult}  = require('express-validator'),
config = require('config'),
accountSid = config.get('TWILIO_ACCOUNT_SID1'),
authToken = config.get('TWILIO_AUTH_TOKEN'),
sid = config.get('TWILIO_SID'),
client = require('twilio')(accountSid, authToken);


//  @route /api/bloodbank/flashrequest
// @desc request for donor for blood
// @access Private

const flashRequest = async(req,res,next) =>{
    let {lat, lang} = req.body;
      lat = parseFloat(lat);
      lang = parseFloat(lang);
     const errors = validationResult(req);
     if(!errors.isEmpty()){
       return res.status(400).json({errors:errors.array()});
     } 
     try{
        let donor = await  Donor.aggregate([
          {
            $geoNear: {
               near: { 
                 type: "Point",
                 coordinates: [ lat , lang]
               },
               distanceField: "distance",
               maxDistance:300000,
               spherical: true
            }
          }
         ]);
         
        console.log(donor);
        //const profile = await Profile.findById(donor.user).populate('user');
        //console.log(profile);
        client.messages
  .create({
        to:+919632269899,
        from: +16209797645,
        body: "hello"
  })
  .then(message => {
        console.log(message.sid);
  })
  .catch(err => console.error(err));
    }
        catch(err){
            console.log(err);
            return res.status(500).send('Server error');
        }
}

exports.flashRequest=flashRequest;