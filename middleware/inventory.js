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
	Expiry = require('../models/bloodBank/inventory/expirySchema'),
	config = require('config');
module.exports = async (req, res, next) => {
	await next();
	const bankID = req.bloodBank.id;

	try {
		let inventory = await Inventory.findOne({ bloodBankID: req.bloodBank.id });
		if (!inventory) {
			inventory = new Inventory({
				bloodBankID: req.bloodBank.id,
			});
		}
		// ########
		// CRYO
		// ########
		// A+Ve
		let count = 0;
		let cryo = await CRYO.find({ bankID, group: 'A+Ve' });
		cryo.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'Cryoprecipitate',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await CRYO.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.cryo['A+Ve'] = count;
		// A-Ve
		count = 0;
		cryo = await CRYO.find({ bankID, group: 'A-Ve' });
		cryo.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'Cryoprecipitate',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await CRYO.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.cryo['A-Ve'] = count;
		// AB+Ve
		count = 0;
		cryo = await CRYO.find({ bankID, group: 'AB+Ve' });
		cryo.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'Cryoprecipitate',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await CRYO.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.cryo['AB+Ve'] = count;
		// AB-Ve
		count = 0;
		cryo = await CRYO.find({ bankID, group: 'AB-Ve' });
		cryo.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'Cryoprecipitate',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await CRYO.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.cryo['AB-Ve'] = count;
		// B+Ve
		count = 0;
		cryo = await CRYO.find({ bankID, group: 'B+Ve' });
		cryo.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'Cryoprecipitate',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await CRYO.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.cryo['B+Ve'] = count;
		// B-Ve
		count = 0;
		cryo = await CRYO.find({ bankID, group: 'B-Ve' });
		cryo.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'Cryoprecipitate',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await CRYO.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.cryo['B-Ve'] = count;
		// O+Ve
		count = 0;
		cryo = await CRYO.find({ bankID, group: 'O+Ve' });
		cryo.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'Cryoprecipitate',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await CRYO.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.cryo['O+Ve'] = count;
		// O-Ve
		count = 0;
		cryo = await CRYO.find({ bankID, group: 'O-Ve' });
		cryo.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'Cryoprecipitate',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await CRYO.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.cryo['O-Ve'] = count;
		// ########
		// FFP
		// ########
		// A+Ve
		count = 0;
		let ffp = await FFP.find({ bankID, group: 'A+Ve' });
		ffp.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'FFP',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await FFP.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.ffp['A+Ve'] = count;
		// A-Ve
		count = 0;
		ffp = await FFP.find({ bankID, group: 'A-Ve' });
		ffp.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'FFP',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await FFP.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.ffp['A-Ve'] = count;
		// AB+Ve
		count = 0;
		ffp = await FFP.find({ bankID, group: 'AB+Ve' });
		ffp.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'FFP',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await FFP.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.ffp['AB+Ve'] = count;
		// AB-Ve
		count = 0;
		ffp = await FFP.find({ bankID, group: 'AB-Ve' });
		ffp.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'FFP',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await FFP.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.ffp['AB-Ve'] = count;
		// B+Ve
		count = 0;
		ffp = await FFP.find({ bankID, group: 'B+Ve' });
		ffp.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'FFP',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await FFP.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.ffp['B+Ve'] = count;
		// B-Ve
		count = 0;
		ffp = await FFP.find({ bankID, group: 'B-Ve' });
		ffp.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'FFP',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await FFP.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.ffp['B-Ve'] = count;
		// O+Ve
		count = 0;
		ffp = await FFP.find({ bankID, group: 'O+Ve' });
		ffp.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'FFP',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await FFP.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.ffp['O+Ve'] = count;
		// O-Ve
		count = 0;
		ffp = await FFP.find({ bankID, group: 'O-Ve' });
		ffp.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'FFP',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await FFP.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.ffp['O-Ve'] = count;
		// ########
		// PLASMA
		// ########
		// A+Ve
		count = 0;
		let plasma = await PLASMA.find({ bankID, group: 'A+Ve' });
		plasma.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'Plasma',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await PLASMA.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.plasma['A+Ve'] = count;
		// A-Ve
		count = 0;
		plasma = await PLASMA.find({ bankID, group: 'A-Ve' });
		plasma.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'Plasma',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await PLASMA.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.plasma['A-Ve'] = count;
		// AB+Ve
		count = 0;
		plasma = await PLASMA.find({ bankID, group: 'AB+Ve' });
		plasma.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'Plasma',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await PLASMA.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.plasma['AB+Ve'] = count;
		// AB-Ve
		count = 0;
		plasma = await PLASMA.find({ bankID, group: 'AB-Ve' });
		plasma.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'Plasma',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await PLASMA.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.plasma['AB-Ve'] = count;
		// B+Ve
		count = 0;
		plasma = await PLASMA.find({ bankID, group: 'B+Ve' });
		plasma.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'Plasma',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await PLASMA.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.plasma['B+Ve'] = count;
		// B-Ve
		count = 0;
		plasma = await PLASMA.find({ bankID, group: 'B-Ve' });
		plasma.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'Plasma',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await PLASMA.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.plasma['B-Ve'] = count;
		// O+Ve
		count = 0;
		plasma = await PLASMA.find({ bankID, group: 'O+Ve' });
		plasma.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'Plasma',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await PLASMA.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.plasma['O+Ve'] = count;
		// O-Ve
		count = 0;
		plasma = await PLASMA.find({ bankID, group: 'O-Ve' });
		plasma.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'Plasma',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await PLASMA.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.plasma['O-Ve'] = count;
		// ########
		// PLATELET
		// ########
		// A+Ve
		count = 0;
		let platelet = await PLATELET.find({ bankID, group: 'A+Ve' });
		platelet.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'Platelet',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await PLATELET.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.platelet['A+Ve'] = count;
		// A-Ve
		count = 0;
		platelet = await PLATELET.find({ bankID, group: 'A-Ve' });
		platelet.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'Platelet',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await PLATELET.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.platelet['A-Ve'] = count;
		// AB+Ve
		count = 0;
		platelet = await PLATELET.find({ bankID, group: 'AB+Ve' });
		platelet.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'Platelet',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await PLATELET.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.platelet['AB+Ve'] = count;
		// AB-Ve
		count = 0;
		platelet = await PLATELET.find({ bankID, group: 'AB-Ve' });
		platelet.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'Platelet',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await PLATELET.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.platelet['AB-Ve'] = count;
		// B+Ve
		count = 0;
		platelet = await PLATELET.find({ bankID, group: 'B+Ve' });
		platelet.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'Platelet',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await PLATELET.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.platelet['B+Ve'] = count;
		// B-Ve
		count = 0;
		platelet = await PLATELET.find({ bankID, group: 'B-Ve' });
		platelet.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'Platelet',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await PLATELET.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.platelet['B-Ve'] = count;
		// O+Ve
		count = 0;
		platelet = await PLATELET.find({ bankID, group: 'O+Ve' });
		platelet.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'Platelet',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await PLATELET.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.platelet['O+Ve'] = count;
		// O-Ve
		count = 0;
		platelet = await PLATELET.find({ bankID, group: 'O-Ve' });
		platelet.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'Platelet',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await PLATELET.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.platelet['O-Ve'] = count;
		// ########
		// RBC
		// ########
		// A+Ve
		count = 0;
		let rbc = await RBC.find({ bankID, group: 'A+Ve' });
		rbc.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'PRBC',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await RBC.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.rbc['A+Ve'] = count;
		// A-Ve
		count = 0;
		rbc = await RBC.find({ bankID, group: 'A-Ve' });
		rbc.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'PRBC',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await RBC.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.rbc['A-Ve'] = count;
		// AB+Ve
		count = 0;
		rbc = await RBC.find({ bankID, group: 'AB+Ve' });
		rbc.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'PRBC',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await RBC.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.rbc['AB+Ve'] = count;
		// AB-Ve
		count = 0;
		rbc = await RBC.find({ bankID, group: 'AB-Ve' });
		rbc.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'PRBC',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await RBC.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.rbc['AB-Ve'] = count;
		// B+Ve
		count = 0;
		rbc = await RBC.find({ bankID, group: 'B+Ve' });
		rbc.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'PRBC',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await RBC.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.rbc['B+Ve'] = count;
		// B-Ve
		count = 0;
		rbc = await RBC.find({ bankID, group: 'B-Ve' });
		rbc.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'PRBC',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await RBC.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.rbc['B-Ve'] = count;
		// O+Ve
		count = 0;
		rbc = await RBC.find({ bankID, group: 'O+Ve' });
		rbc.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'PRBC',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await RBC.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.rbc['O+Ve'] = count;
		// O-Ve
		count = 0;
		rbc = await RBC.find({ bankID, group: 'O-Ve' });
		rbc.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'PRBC',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await RBC.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.rbc['O-Ve'] = count;
		// ########
		// SAGM
		// ########
		// A+Ve
		count = 0;
		let sagm = await SAGM.find({ bankID, group: 'A+Ve' });
		sagm.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'SPRBC',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await SAGM.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.sagm['A+Ve'] = count;
		// A-Ve
		count = 0;
		sagm = await SAGM.find({ bankID, group: 'A-Ve' });
		sagm.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'SPRBC',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await SAGM.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.sagm['A-Ve'] = count;
		// AB+Ve
		count = 0;
		sagm = await SAGM.find({ bankID, group: 'AB+Ve' });
		sagm.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'SPRBC',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await SAGM.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.sagm['AB+Ve'] = count;
		// AB-Ve
		count = 0;
		sagm = await SAGM.find({ bankID, group: 'AB-Ve' });
		sagm.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'SPRBC',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await SAGM.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.sagm['AB-Ve'] = count;
		// B+Ve
		count = 0;
		sagm = await SAGM.find({ bankID, group: 'B+Ve' });
		sagm.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'SPRBC',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await SAGM.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.sagm['B+Ve'] = count;
		// B-Ve
		count = 0;
		sagm = await SAGM.find({ bankID, group: 'B-Ve' });
		sagm.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'SPRBC',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await SAGM.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.sagm['B-Ve'] = count;
		// O+Ve
		count = 0;
		sagm = await SAGM.find({ bankID, group: 'O+Ve' });
		sagm.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'SPRBC',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await SAGM.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.sagm['O+Ve'] = count;
		// O-Ve
		count = 0;
		sagm = await SAGM.find({ bankID, group: 'O-Ve' });
		sagm.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'SPRBC',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await SAGM.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.sagm['O-Ve'] = count;
		// ########
		// SDPLASMA
		// ########
		// A+Ve
		count = 0;
		let sdplasma = await SDPLASMA.find({ bankID, group: 'A+Ve' });
		sdplasma.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'SDPlasma',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await SDPLASMA.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.sdplasma['A+Ve'] = count;
		// A-Ve
		count = 0;
		sdplasma = await SDPLASMA.find({ bankID, group: 'A-Ve' });
		sdplasma.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'SDPlasma',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await SDPLASMA.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.sdplasma['A-Ve'] = count;
		// AB+Ve
		count = 0;
		sdplasma = await SDPLASMA.find({ bankID, group: 'AB+Ve' });
		sdplasma.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'SDPlasma',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await SDPLASMA.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.sdplasma['AB+Ve'] = count;
		// AB-Ve
		count = 0;
		sdplasma = await SDPLASMA.find({ bankID, group: 'AB-Ve' });
		sdplasma.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'SDPlasma',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await SDPLASMA.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.sdplasma['AB-Ve'] = count;
		// B+Ve
		count = 0;
		sdplasma = await SDPLASMA.find({ bankID, group: 'B+Ve' });
		sdplasma.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'SDPlasma',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await SDPLASMA.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.sdplasma['B+Ve'] = count;
		// B-Ve
		count = 0;
		sdplasma = await SDPLASMA.find({ bankID, group: 'B-Ve' });
		sdplasma.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'SDPlasma',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await SDPLASMA.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.sdplasma['B-Ve'] = count;
		// O+Ve
		count = 0;
		sdplasma = await SDPLASMA.find({ bankID, group: 'O+Ve' });
		sdplasma.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'SDPlasma',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await SDPLASMA.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.sdplasma['O+Ve'] = count;
		// O-Ve
		count = 0;
		sdplasma = await SDPLASMA.find({ bankID, group: 'O-Ve' });
		sdplasma.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'SDPlasma',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await SDPLASMA.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.sdplasma['O-Ve'] = count;
		// ########
		// SDPLATE
		// ########
		// A+Ve
		count = 0;
		let sdplate = await SDPLATE.find({ bankID, group: 'A+Ve' });
		sdplate.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'SDPlatelet',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await SDPLATE.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.sdplate['A+Ve'] = count;
		// A-Ve
		count = 0;
		sdplate = await SDPLATE.find({ bankID, group: 'A-Ve' });
		sdplate.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'SDPlatelet',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await SDPLATE.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.sdplate['A-Ve'] = count;
		// AB+Ve
		count = 0;
		sdplate = await SDPLATE.find({ bankID, group: 'AB+Ve' });
		sdplate.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'SDPlatelet',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await SDPLATE.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.sdplate['AB+Ve'] = count;
		// AB-Ve
		count = 0;
		sdplate = await SDPLATE.find({ bankID, group: 'AB-Ve' });
		sdplate.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'SDPlatelet',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await SDPLATE.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.sdplate['AB-Ve'] = count;
		// B+Ve
		count = 0;
		sdplate = await SDPLATE.find({ bankID, group: 'B+Ve' });
		sdplate.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'SDPlatelet',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await SDPLATE.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.sdplate['B+Ve'] = count;
		// B-Ve
		count = 0;
		sdplate = await SDPLATE.find({ bankID, group: 'B-Ve' });
		sdplate.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'SDPlatelet',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await SDPLATE.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.sdplate['B-Ve'] = count;
		// O+Ve
		count = 0;
		sdplate = await SDPLATE.find({ bankID, group: 'O+Ve' });
		sdplate.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'SDPlatelet',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await SDPLATE.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.sdplate['O+Ve'] = count;
		// O-Ve
		count = 0;
		sdplate = await SDPLATE.find({ bankID, group: 'O-Ve' });
		sdplate.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'SDPlatelet',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await SDPLATE.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.sdplate['O-Ve'] = count;
		// ########
		// WBC
		// ########
		// A+Ve
		count = 0;
		let wbc = await WBC.find({ bankID, group: 'A+Ve' });
		wbc.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'WBC',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await WBC.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.wbc['A+Ve'] = count;
		// A-Ve
		count = 0;
		wbc = await WBC.find({ bankID, group: 'A-Ve' });
		wbc.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'WBC',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await WBC.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.wbc['A-Ve'] = count;
		// AB+Ve
		count = 0;
		wbc = await WBC.find({ bankID, group: 'AB+Ve' });
		wbc.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'WBC',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await WBC.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.wbc['AB+Ve'] = count;
		// AB-Ve
		count = 0;
		wbc = await WBC.find({ bankID, group: 'AB-Ve' });
		wbc.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'WBC',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await WBC.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.wbc['AB-Ve'] = count;
		// B+Ve
		count = 0;
		wbc = await WBC.find({ bankID, group: 'B+Ve' });
		wbc.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'WBC',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await WBC.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.wbc['B+Ve'] = count;
		// B-Ve
		count = 0;
		wbc = await WBC.find({ bankID, group: 'B-Ve' });
		wbc.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'WBC',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await WBC.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.wbc['B-Ve'] = count;
		// O+Ve
		count = 0;
		wbc = await WBC.find({ bankID, group: 'O+Ve' });
		wbc.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'WBC',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await WBC.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.wbc['O+Ve'] = count;
		// O-Ve
		count = 0;
		wbc = await WBC.find({ bankID, group: 'O-Ve' });
		wbc.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'WBC',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await WBC.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.wbc['O-Ve'] = count;
		// ########
		// WHOLE
		// ########
		// A+Ve
		count = 0;
		let whole = await WHOLE.find({ bankID, group: 'A+Ve' });
		whole.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'WholeBlood',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await WHOLE.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.whole['A+Ve'] = count;
		// A-Ve
		count = 0;
		whole = await WHOLE.find({ bankID, group: 'A-Ve' });
		whole.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'WholeBlood',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await WHOLE.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.whole['A-Ve'] = count;
		// AB+Ve
		count = 0;
		whole = await WHOLE.find({ bankID, group: 'AB+Ve' });
		whole.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'WholeBlood',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await WHOLE.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.whole['AB+Ve'] = count;
		// AB-Ve
		count = 0;
		whole = await WHOLE.find({ bankID, group: 'AB-Ve' });
		whole.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'WholeBlood',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await WHOLE.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.whole['AB-Ve'] = count;
		// B+Ve
		count = 0;
		whole = await WHOLE.find({ bankID, group: 'B+Ve' });
		whole.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'WholeBlood',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await WHOLE.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.whole['B+Ve'] = count;
		// B-Ve
		count = 0;
		whole = await WHOLE.find({ bankID, group: 'B-Ve' });
		whole.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'WholeBlood',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await WHOLE.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.whole['B-Ve'] = count;
		// O+Ve
		count = 0;
		whole = await WHOLE.find({ bankID, group: 'O+Ve' });
		whole.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'WholeBlood',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await WHOLE.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.whole['O+Ve'] = count;
		// O-Ve
		count = 0;
		whole = await WHOLE.find({ bankID, group: 'O-Ve' });
		whole.map(async (item) => {
			try {
				const ticket = jwt.verify(item.ticket, config.get('STOCKSECRET'));
				if (ticket) {
					count += 1;
				}
			} catch (err) {
				if (err.name == 'TokenExpiredError') {
					const {
						donor,
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					} = item;
					const expired = await new Expiry({
						bankID: req.bloodBank.id,
						donor,
						component: 'WholeBlood',
						group,
						segment,
						expiryDate,
						donationDate,
						ticket,
						bagNumber,
					});
					await expired.save();
					await WHOLE.findByIdAndDelete(item.id);
				} else {
					console.error(err);
				}
			}
		});
		inventory.whole['O-Ve'] = count;
		await inventory.save();
		console.log('Inventory Updated!');
	} catch (err) {
		console.error(err);
		res.status(500).json({ msg: 'Inventory Update Failed!' });
	}
};
