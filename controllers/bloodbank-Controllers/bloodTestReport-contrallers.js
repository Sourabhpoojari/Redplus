const bloodTestReport = require("../../models/bloodbank/bloodTestReportSchema"),
    Profile = require('../../models/user/profileSchema');

//  @route /api/bloodbank/bloodTestReport/
// @desc post bloodtest Report
// @access Private

const bloodTReport = async(req,res,next =>{
    let {typeOfBag,quantity,bagNumber,bgroup,batch,segNumber,expdate,rbcCount,wbcCount,plateCount,hemoglobinCount,hematocrit,bglucose,anyDiseases} = req.body;

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    try{
        const test=bloodTestReport.findOne('');
        let data = new bloodTestReport ({
            typeOfBag,
            quantity,
            bgroup,
            batch,
            segNumber,
            expdate,
            rbcCount,
            wbcCount,
            plateCount,
            hemoglobinCount,
            hematocrit,
            bglucose,
            anyDiseases
    });
    data.save();
    return  res.json(data);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

exports.bloodTReport=bloodTestReport;