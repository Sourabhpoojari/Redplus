const BloodBankRequest = require('../../models/admin/requests/bloodBankRequestSchema'),
{validationResult} = require('express-validator');


//  @route /api/bloodBank/signup
// @desc  post blood bank signup request
// @access Public
const signUp = async (req,res,next) => {
    const {bloodBankName, bloodBankEmail, bloodBankAddress, bloodBankPhone, bloodBankRegistrationNumber, bloodBankLat, bloodBankLng, bloodBankRegistrationDocument} = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    let request;
    try {
        request = await BloodBankRequest.findOne({bloodBankEmail});
        if(request){
            return res.status(400).json({errors:[{msg : "Blood Bank already exists!"}]});
        }
        request = await new BloodBankRequest({
            bloodBankName, bloodBankEmail, bloodBankAddress, bloodBankPhone, bloodBankRegistrationNumber, bloodBankRegistrationDocument
        });
        if (bloodBankLng && bloodBankLat) {
            // request.location.coordinates.append(bloodBankLat,bloodBankLng);
            request.location.coordinates = [
                bloodBankLat,bloodBankLng
            ];
        }
        await request.save();
        return res.status(200).json(request);
    } catch (err) {
        console.log(err);
        return res.status(500).send('Server error');
    }
}



exports.signUp = signUp;