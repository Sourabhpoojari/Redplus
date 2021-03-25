const PTest= require('../../models/user/primarytestSchema');
      user=require('../../models/user/profileSchema')


//  @route /api/user/primarytest/:user_id
// @desc post primarytest info
// @access Private

const primarytest = async (req,res,next) => {
    let {weight,pulse,hb,bp,tempreture} = req.body;
}