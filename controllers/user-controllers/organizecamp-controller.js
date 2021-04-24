const  {validationResult} = require('express-validator'),
campSheduleRequest = require('../../models/admin/requests/campsheduleReuestSchema');
//campShema = require('../../models/user/organizecampSchema');

//  @route /api/user/campshedule
// @desc  post campshedule request
// @access private

const campRequest = async (req,res,next) =>{
        const {campAddress,campName,campSchedule,capacity,community,organizerContactNumber,organizerName,referenceId,sponserOrganization,campLat,campLng}=req.body;
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }
        let request;
        try {
            request = await campSheduleRequest.findOne({organizerContactNumber});
            if(request){
                return res.status(400).json({errors:[{msg : "Already request sent!"}]});
            }
            request = await new campSheduleRequest({
                campAddress, campName, campSchedule, capacity, community, organizerContactNumber,organizerName,referenceId,sponserOrganization
            });
            if (campLat && campLng) {
                request.location.coordinates = [
                    campLat,campLng
                ];
                request.location.type = "Point";
            }
            await request.save();
            return res.status(200).json(request);
        }
        catch (err) {
            console.log(err);
            return res.status(500).send('Server error');
        }
}


exports.campRequest = campRequest;