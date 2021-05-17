const Inventory = require('../../models/bloodBank/inventory/inventorySchema');

//  @route /api/bloodbank/inventory
// @desc get inventory dashboard
// @access Private - bloodBank access only
const getInventory = async (req, res, next) => {
	try {
		const inventory = await Inventory.findOne({
			bloodBankID: req.bloodBank.id,
		});
		if (!inventory) {
			return res.status(404).send('Inventory not Found!!');
		}
		return res.status(201).json({ inventory });
	} catch (err) {
		console.error(err);
		return res.status(500).send('Server error');
	}
};

exports.getInventory = getInventory;
