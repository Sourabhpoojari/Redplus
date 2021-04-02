const bloodTestReport = require("../../models/bloodbank/bloodTestReportSchema"),
    Profile = require('../../models/user/profileSchema');

//  @route /api/bloodbank/bloodTestReport/
// @desc post bloodtest Report
// @access Private

const bloodTReport = async(req,res,next =>{
    let {typeOfBag,quantity,bagNumber,bgroup,batch,segNumber,expdate,rbcCount,wbcCount,plateCount,hemoglobinCount,hematocrit,bglucose,anyDiseases} = req.body;


    
})