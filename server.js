const express = require('express'),
	app = express(),
	connectDB = require('./config/db'),
	bodyParser = require('body-parser'),
	cors = require('cors');

// DB connection`
connectDB();

// app.use()
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// routes
app.use('/api/user', require('./routes/user/user-routes'));
app.use('/api/user/profile', require('./routes/user/profile-routes'));
app.use('/api/user', require('./routes/user/health-routes'));
//app.use('/api/bloodbank/test',require('./routes/bloodbank/test-routes'));
app.use('/api/user', require('./routes/user/donateblood-routes'));
app.use('/api/user/findBlood', require('./routes/user/findblood-routes'));
app.use('/api/user/usercamp', require('./routes/user/organizeCamp-routes'));
app.use('/api/user/donations', require('./routes/user/donation-routes'));
app.use('/api/user/findblood', require('././routes/user/findblood-routes'));

// admin routes
app.use('/api/admin/', require('./routes/admin/admin-routes'));

app.use('/api/admin/requests', require('./routes/admin/request-routes'));

app.use('/api/admin/post', require('././routes/admin/post-routes'));

// bloodBank routes
app.use('/api/bloodBank', require('./routes/bloodBank/bloodBank-routes'));

app.use(
	'/api/bloodBank/requests',
	require('./routes/bloodBank/request-routes')
);

app.use('/api/bloodBank/test', require('./routes/bloodBank/test-routes'));

app.use(
	'/api/bloodbank/bloodcamp',
	require('./routes/bloodBank/organizeCamp-routes')
);

app.use(
	'/api/bloodbank/flashrequest',
	require('./routes/bloodBank/flashrequest-routes')
);

app.use(
	'/api/bloodBank/inventory',
	require('./routes/bloodBank/inventory-routes')
);

app.use(
	'/api/bloodBank/pricing',
	require('././routes/bloodBank/pricing-routes')
);
app.use('/api/bloodBank/billing', require('./routes/bloodBank/billing-routes'));
app.use('/api/bloodBank/bill', require('./routes/bloodBank/bill-routes'));

app.use('/api/bloodBank/expiry', require('./routes/bloodBank/expiry-routes'));
app.use(
	'/api/bloodBank/components',
	require('./routes/bloodBank/component-routes')
);
//hospital routes
app.use('/api/hospital', require('./routes/hospital/hospital-routes'));

app.use(
	'/api/hospital/findblood',
	require('./routes/hospital/findblood-routes')
);

app.use('/api/hospital/billing', require('././routes/hospital/billing-routes'));

app.use('/api/hospital/bill', require('./routes/hospital/bill-routes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
