const  {validationResult} = require('express-validator'),
campSheduleRequest = require('../../models/admin/requests/campsheduleReuestSchema'),
Profile = require('../../models/user/profileSchema');
//campShema = require('../../models/user/organizecampSchema');

//  @route /api/user/campshedule
// @desc  post campshedule request
// @access private

const campRequest = async(req,res,next) =>{
        const {campAddress,campName,campSchedule,capacity,community,referenceId,sponserOrganization,poster,campLat,campLng}=req.body;
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }
        try {
           
            const request = await new campSheduleRequest({
                user:req.user.id,
                campAddress, campName, campSchedule, capacity, community,poster,referenceId,sponserOrganization
            });
            if (campLat && campLng) {
                request.location.coordinates = [
                    campLat,campLng
                ];
                request.location.type = "Point";
            }
            const profile = await Profile.find({user:req.user.id});
            if(!profile){
                return res.status(400).json({msg:"Please update your profile"});
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