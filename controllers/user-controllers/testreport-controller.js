const TestReport = require('../../models/user/bloodTestReportSchema');

//  @route /api/user/testreport
// @desc get  of details of testreport
// @access Private to donor

const getTestReport = async(req,res,next) =>{
    try{
        let report = await TestReport.findOne({user:req.user.id}).sort('createdOn');
        if(!report){
            return res.status(400).json({msg:"report not found"});
        }
        
        
        return res.status(200).json(report);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send("Server error");
    }
}


exports.getTestReport=getTestReport;