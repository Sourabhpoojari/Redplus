const Donor = require('../../models/user/donorlocationSchema'),
Profile = require('../../models/user/userSchema'),
{validationResult}  = require('express-validator'),
config = require('config');
accountSid = config.get('TWILIO_ACCOUNT_SID1'),
authToken = config.get('TWILIO_AUTH_TOKEN'),
sid = config.get('TWILIO_SID'),
client = require('twilio')(accountSid, authToken);
// var TeleSignSDK = require('telesignsdk');

	//   const customerId = "2C04EC32-53E4-4292-B976-B41694C54365";
	//   const apiKey = "KZ6qHz1gH+GW79OMoD21PtjLNyJWFZumyySokIVZofOOmwKAKucsu/SftREqg2TN2ka95e5eBrZkDwD1iO0tLg==";
	//   const rest_endpoint = "https://rest-api.telesign.com";

//  Vonage = require('@vonage/server-sdk')

// const vonage = new Vonage({
//   apiKey: "4e41a3b5",
//   apiSecret: "rxVqwTo0OH6lnKjo"
// });

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
         
  //       var messagebird = require('messagebird')('W1KuTg575l5Q1QDZIxII1kI7T');

  //   var params = {
  //     'originator': 'MessageBird',
  //     'recipients': [
  //       '+919741925186'
  //   ],
  //     'body': 'This is a test message'
  //   };

  //   messagebird.messages.create(params, function (err, response) {
  //     if (err) {
  //       return console.log(err);
  //     }
  //     console.log(response);
  //   });
  // }
//   const from = "Vonage APIs"
// const to = "919741925186"
// const text = 'A text message sent using the Vonage SMS API'

// vonage.message.sendSms(from, to, text, (err, responseData) => {
//     if (err) {
//         console.log(err);
//     } else {
//         if(responseData.messages[0]['status'] === "0") {
//             console.log("Message sent successfully.");
//         } else {
//             console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
//         }
//     }
// });
// console.log('sent');
//      }

//   catch(err){

//   }
// }
         
//         console.log(donor);
//         //const profile = await Profile.findById(donor.user).populate('user');
//         //console.log(profile);
//         client.messages
//   .create({
//         to:+91963226989,
//         from: +16209797645,
//         body: "hello"
//   })
//   // .then(message => {
//   //       console.log(message.sid);
//   // })
//   .catch(err => console.error(err));
// }
// catch(err){

// }
// }
//   const client = new TeleSignSDK( customerId,
//     apiKey,
//     rest_endpoint
//     // timeout // optional
//     // // userAgent
// );

// const phoneNumber = "+916361139380";
// const message = "You're scheduled for a dentist appointment at 2:30PM.";
// const messageType = "ARN";

// console.log("## MessagingClient.message ##");

// function messageCallback(error, responseBody) {
//     if (error === null) {
//         console.log(`Messaging response for messaging phone number: ${phoneNumber}` +
//             ` => code: ${responseBody['status']['code']}` +
//             `, description: ${responseBody['status']['description']}`);
//     } else {
//         console.error("Unable to send message. " + error);
//     }
// }
// client.sms.message(messageCallback, phoneNumber, message, messageType);
//     }
//         catch(err){
//             console.log(err);
//             return res.status(500).send('Server error');
//         }

 }
 catch(err){
  console.log(err);
 }
}
exports.flashRequest=flashRequest;
