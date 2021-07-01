const  {validationResult} = require('express-validator'),
campSheduleRequest = require('../../models/admin/requests/campsheduleReuestSchema'),
moment = require('moment'),
Profile = require('../../models/user/profileSchema');
//campShema = require('../../models/user/organizecampSchema');

//  @route /api/user/campshedule
// @desc  post campshedule request
// @access private

const campRequest = async(req,res,next) =>{
        let {address,title,date,timefrom,timeto,donations,organization,requestForm,poster,bloodBanks,campLat,campLng}=req.body;
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }
        try {
            let request = await new campSheduleRequest({
                orgainizer:req.user.id,
                address, title,
                date,
                timefrom, 
                timeto,
                donations,organization, requestForm,poster,bloodBanks
            });
            timefrom = moment(timefrom, 'HH:mm').format('hh:mm A');
            timeto = moment(timeto, 'HH:mm').format('hh:mm A');
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