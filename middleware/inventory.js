const Inventory = require('../models/bloodBank/inventory/inventorySchema'),
	CRYO = require('../models/bloodBank/storage/cryo-schema'),
	FFP = require('../models/bloodBank/storage/ffp-schema'),
	PLASMA = require('../models/bloodBank/storage/plasma-schema'),
	PLATELET = require('../models/bloodBank/storage/platelet-schema'),
	RBC = require('../models/bloodBank/storage/rbc-schema'),
	SAGM = require('../models/bloodBank/storage/sagm-schema'),
	SDPLASMA = require('../models/bloodBank/storage/sdplasma-schema'),
	SDPLATE = require('../models/bloodBank/storage/sdplate-schema'),
	WBC = require('../models/bloodBank/storage/wbc-schema'),
	WHOLE = require('../models/bloodBank/storage/whole-schema'),
	jwt = require('jsonwebtoken'),
	config = require('config');
module.exports = async (req, res, next) => {
	const bankID = req.bloodBank.id;

	try {
		let inventory = await Inventory.findOne({ bloodBankID: req.bloodBank.id });
		if (!inventory) {
			next();
		}
		// ########
		// CRYO
		// ########
		// A+Ve
		let count = 0;
		let cryo = await CRYO.find({ bankID, group: 'A+Ve' });
		cryo.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.cryo['A+Ve'] = count;
		// A-Ve
		count = 0;
		cryo = await CRYO.find({ bankID, group: 'A-Ve' });
		cryo.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.cryo['A-Ve'] = count;
		// AB+Ve
		count = 0;
		cryo = await CRYO.find({ bankID, group: 'AB+Ve' });
		cryo.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.cryo['AB+Ve'] = count;
		// AB-Ve
		count = 0;
		cryo = await CRYO.find({ bankID, group: 'AB-Ve' });
		cryo.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.cryo['AB-Ve'] = count;
		// B+Ve
		count = 0;
		cryo = await CRYO.find({ bankID, group: 'B+Ve' });
		cryo.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.cryo['B+Ve'] = count;
		// B-Ve
		count = 0;
		cryo = await CRYO.find({ bankID, group: 'B-Ve' });
		cryo.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.cryo['B-Ve'] = count;
		// O+Ve
		count = 0;
		cryo = await CRYO.find({ bankID, group: 'O+Ve' });
		cryo.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.cryo['O+Ve'] = count;
		// O-Ve
		count = 0;
		cryo = await CRYO.find({ bankID, group: 'O-Ve' });
		cryo.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.cryo['O-Ve'] = count;
		// ########
		// FFP
		// ########
		// A+Ve
		count = 0;
		let ffp = await FFP.find({ bankID, group: 'A+Ve' });
		ffp.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.ffp['A+Ve'] = count;
		// A-Ve
		count = 0;
		ffp = await FFP.find({ bankID, group: 'A-Ve' });
		ffp.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.ffp['A-Ve'] = count;
		// AB+Ve
		count = 0;
		ffp = await FFP.find({ bankID, group: 'AB+Ve' });
		ffp.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.ffp['AB+Ve'] = count;
		// AB-Ve
		count = 0;
		ffp = await FFP.find({ bankID, group: 'AB-Ve' });
		ffp.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.ffp['AB-Ve'] = count;
		// B+Ve
		count = 0;
		ffp = await FFP.find({ bankID, group: 'B+Ve' });
		ffp.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.ffp['B+Ve'] = count;
		// B-Ve
		count = 0;
		ffp = await FFP.find({ bankID, group: 'B-Ve' });
		ffp.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.ffp['B-Ve'] = count;
		// O+Ve
		count = 0;
		ffp = await FFP.find({ bankID, group: 'O+Ve' });
		ffp.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.ffp['O+Ve'] = count;
		// O-Ve
		count = 0;
		ffp = await FFP.find({ bankID, group: 'O-Ve' });
		ffp.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.ffp['O-Ve'] = count;
		// ########
		// PLASMA
		// ########
		// A+Ve
		count = 0;
		let plasma = await PLASMA.find({ bankID, group: 'A+Ve' });
		plasma.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.plasma['A+Ve'] = count;
		// A-Ve
		count = 0;
		plasma = await PLASMA.find({ bankID, group: 'A-Ve' });
		plasma.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.plasma['A-Ve'] = count;
		// AB+Ve
		count = 0;
		plasma = await PLASMA.find({ bankID, group: 'AB+Ve' });
		plasma.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.plasma['AB+Ve'] = count;
		// AB-Ve
		count = 0;
		plasma = await PLASMA.find({ bankID, group: 'AB-Ve' });
		plasma.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.plasma['AB-Ve'] = count;
		// B+Ve
		count = 0;
		plasma = await PLASMA.find({ bankID, group: 'B+Ve' });
		plasma.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.plasma['B+Ve'] = count;
		// B-Ve
		count = 0;
		plasma = await PLASMA.find({ bankID, group: 'B-Ve' });
		plasma.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.plasma['B-Ve'] = count;
		// O+Ve
		count = 0;
		plasma = await PLASMA.find({ bankID, group: 'O+Ve' });
		plasma.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.plasma['O+Ve'] = count;
		// O-Ve
		count = 0;
		plasma = await PLASMA.find({ bankID, group: 'O-Ve' });
		plasma.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.plasma['O-Ve'] = count;
		// ########
		// PLATELET
		// ########
		// A+Ve
		count = 0;
		let platelet = await PLATELET.find({ bankID, group: 'A+Ve' });
		platelet.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.platelet['A+Ve'] = count;
		// A-Ve
		count = 0;
		platelet = await PLATELET.find({ bankID, group: 'A-Ve' });
		platelet.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.platelet['A-Ve'] = count;
		// AB+Ve
		count = 0;
		platelet = await PLATELET.find({ bankID, group: 'AB+Ve' });
		platelet.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.platelet['AB+Ve'] = count;
		// AB-Ve
		count = 0;
		platelet = await PLATELET.find({ bankID, group: 'AB-Ve' });
		platelet.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.platelet['AB-Ve'] = count;
		// B+Ve
		count = 0;
		platelet = await PLATELET.find({ bankID, group: 'B+Ve' });
		platelet.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.platelet['B+Ve'] = count;
		// B-Ve
		count = 0;
		platelet = await PLATELET.find({ bankID, group: 'B-Ve' });
		platelet.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.platelet['B-Ve'] = count;
		// O+Ve
		count = 0;
		platelet = await PLATELET.find({ bankID, group: 'O+Ve' });
		platelet.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.platelet['O+Ve'] = count;
		// O-Ve
		count = 0;
		platelet = await PLATELET.find({ bankID, group: 'O-Ve' });
		platelet.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.platelet['O-Ve'] = count;
		// ########
		// RBC
		// ########
		// A+Ve
		count = 0;
		let rbc = await RBC.find({ bankID, group: 'A+Ve' });
		rbc.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.rbc['A+Ve'] = count;
		// A-Ve
		count = 0;
		rbc = await RBC.find({ bankID, group: 'A-Ve' });
		rbc.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.rbc['A-Ve'] = count;
		// AB+Ve
		count = 0;
		rbc = await RBC.find({ bankID, group: 'AB+Ve' });
		rbc.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.rbc['AB+Ve'] = count;
		// AB-Ve
		count = 0;
		rbc = await RBC.find({ bankID, group: 'AB-Ve' });
		rbc.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.rbc['AB-Ve'] = count;
		// B+Ve
		count = 0;
		rbc = await RBC.find({ bankID, group: 'B+Ve' });
		rbc.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.rbc['B+Ve'] = count;
		// B-Ve
		count = 0;
		rbc = await RBC.find({ bankID, group: 'B-Ve' });
		rbc.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.rbc['B-Ve'] = count;
		// O+Ve
		count = 0;
		rbc = await RBC.find({ bankID, group: 'O+Ve' });
		rbc.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.rbc['O+Ve'] = count;
		// O-Ve
		count = 0;
		rbc = await RBC.find({ bankID, group: 'O-Ve' });
		rbc.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.rbc['O-Ve'] = count;
		// ########
		// SAGM
		// ########
		// A+Ve
		count = 0;
		let sagm = await SAGM.find({ bankID, group: 'A+Ve' });
		sagm.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.sagm['A+Ve'] = count;
		// A-Ve
		count = 0;
		sagm = await SAGM.find({ bankID, group: 'A-Ve' });
		sagm.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.sagm['A-Ve'] = count;
		// AB+Ve
		count = 0;
		sagm = await SAGM.find({ bankID, group: 'AB+Ve' });
		sagm.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.sagm['AB+Ve'] = count;
		// AB-Ve
		count = 0;
		sagm = await SAGM.find({ bankID, group: 'AB-Ve' });
		sagm.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.sagm['AB-Ve'] = count;
		// B+Ve
		count = 0;
		sagm = await SAGM.find({ bankID, group: 'B+Ve' });
		sagm.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.sagm['B+Ve'] = count;
		// B-Ve
		count = 0;
		sagm = await SAGM.find({ bankID, group: 'B-Ve' });
		sagm.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.sagm['B-Ve'] = count;
		// O+Ve
		count = 0;
		sagm = await SAGM.find({ bankID, group: 'O+Ve' });
		sagm.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.sagm['O+Ve'] = count;
		// O-Ve
		count = 0;
		sagm = await SAGM.find({ bankID, group: 'O-Ve' });
		sagm.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.sagm['O-Ve'] = count;
		// ########
		// SDPLASMA
		// ########
		// A+Ve
		count = 0;
		let sdplasma = await SDPLASMA.find({ bankID, group: 'A+Ve' });
		sdplasma.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.sdplasma['A+Ve'] = count;
		// A-Ve
		count = 0;
		sdplasma = await SDPLASMA.find({ bankID, group: 'A-Ve' });
		sdplasma.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.sdplasma['A-Ve'] = count;
		// AB+Ve
		count = 0;
		sdplasma = await SDPLASMA.find({ bankID, group: 'AB+Ve' });
		sdplasma.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.sdplasma['AB+Ve'] = count;
		// AB-Ve
		count = 0;
		sdplasma = await SDPLASMA.find({ bankID, group: 'AB-Ve' });
		sdplasma.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.sdplasma['AB-Ve'] = count;
		// B+Ve
		count = 0;
		sdplasma = await SDPLASMA.find({ bankID, group: 'B+Ve' });
		sdplasma.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.sdplasma['B+Ve'] = count;
		// B-Ve
		count = 0;
		sdplasma = await SDPLASMA.find({ bankID, group: 'B-Ve' });
		sdplasma.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.sdplasma['B-Ve'] = count;
		// O+Ve
		count = 0;
		sdplasma = await SDPLASMA.find({ bankID, group: 'O+Ve' });
		sdplasma.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.sdplasma['O+Ve'] = count;
		// O-Ve
		count = 0;
		sdplasma = await SDPLASMA.find({ bankID, group: 'O-Ve' });
		sdplasma.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.sdplasma['O-Ve'] = count;
		// ########
		// SDPLATE
		// ########
		// A+Ve
		count = 0;
		let sdplate = await SDPLATE.find({ bankID, group: 'A+Ve' });
		sdplate.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.sdplate['A+Ve'] = count;
		// A-Ve
		count = 0;
		sdplate = await SDPLATE.find({ bankID, group: 'A-Ve' });
		sdplate.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.sdplate['A-Ve'] = count;
		// AB+Ve
		count = 0;
		sdplate = await SDPLATE.find({ bankID, group: 'AB+Ve' });
		sdplate.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.sdplate['AB+Ve'] = count;
		// AB-Ve
		count = 0;
		sdplate = await SDPLATE.find({ bankID, group: 'AB-Ve' });
		sdplate.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.sdplate['AB-Ve'] = count;
		// B+Ve
		count = 0;
		sdplate = await SDPLATE.find({ bankID, group: 'B+Ve' });
		sdplate.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.sdplate['B+Ve'] = count;
		// B-Ve
		count = 0;
		sdplate = await SDPLATE.find({ bankID, group: 'B-Ve' });
		sdplate.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.sdplate['B-Ve'] = count;
		// O+Ve
		count = 0;
		sdplate = await SDPLATE.find({ bankID, group: 'O+Ve' });
		sdplate.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.sdplate['O+Ve'] = count;
		// O-Ve
		count = 0;
		sdplate = await SDPLATE.find({ bankID, group: 'O-Ve' });
		sdplate.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.sdplate['O-Ve'] = count;
		// ########
		// WBC
		// ########
		// A+Ve
		count = 0;
		let wbc = await WBC.find({ bankID, group: 'A+Ve' });
		wbc.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.wbc['A+Ve'] = count;
		// A-Ve
		count = 0;
		wbc = await WBC.find({ bankID, group: 'A-Ve' });
		wbc.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.wbc['A-Ve'] = count;
		// AB+Ve
		count = 0;
		wbc = await WBC.find({ bankID, group: 'AB+Ve' });
		wbc.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.wbc['AB+Ve'] = count;
		// AB-Ve
		count = 0;
		wbc = await WBC.find({ bankID, group: 'AB-Ve' });
		wbc.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.wbc['AB-Ve'] = count;
		// B+Ve
		count = 0;
		wbc = await WBC.find({ bankID, group: 'B+Ve' });
		wbc.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.wbc['B+Ve'] = count;
		// B-Ve
		count = 0;
		wbc = await WBC.find({ bankID, group: 'B-Ve' });
		wbc.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.wbc['B-Ve'] = count;
		// O+Ve
		count = 0;
		wbc = await WBC.find({ bankID, group: 'O+Ve' });
		wbc.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.wbc['O+Ve'] = count;
		// O-Ve
		count = 0;
		wbc = await WBC.find({ bankID, group: 'O-Ve' });
		wbc.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.wbc['O-Ve'] = count;
		// ########
		// WHOLE
		// ########
		// A+Ve
		count = 0;
		let whole = await WHOLE.find({ bankID, group: 'A+Ve' });
		whole.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.whole['A+Ve'] = count;
		// A-Ve
		count = 0;
		whole = await WHOLE.find({ bankID, group: 'A-Ve' });
		whole.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.whole['A-Ve'] = count;
		// AB+Ve
		count = 0;
		whole = await WHOLE.find({ bankID, group: 'AB+Ve' });
		whole.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.whole['AB+Ve'] = count;
		// AB-Ve
		count = 0;
		whole = await WHOLE.find({ bankID, group: 'AB-Ve' });
		whole.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.whole['AB-Ve'] = count;
		// B+Ve
		count = 0;
		whole = await WHOLE.find({ bankID, group: 'B+Ve' });
		whole.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.whole['B+Ve'] = count;
		// B-Ve
		count = 0;
		whole = await WHOLE.find({ bankID, group: 'B-Ve' });
		whole.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.whole['B-Ve'] = count;
		// O+Ve
		count = 0;
		whole = await WHOLE.find({ bankID, group: 'O+Ve' });
		whole.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.whole['O+Ve'] = count;
		// O-Ve
		count = 0;
		whole = await WHOLE.find({ bankID, group: 'O-Ve' });
		whole.map((item) => {
			if (jwt.verify(item.ticket, config.get('STOCKSECRET'))) {
				count += 1;
			}
		});
		inventory.whole['O-Ve'] = count;
		await inventory.save();
		next();
	} catch (err) {
		console.error(err);
		res.status(500).json({ msg: 'Inventory Update Failed!' });
	}
};
