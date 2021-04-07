const express = require('express'),
        app = express(),
     connectDB = require('./config/db'),
     bodyParser = require('body-parser'),
     cors = require('cors');


// DB connection
connectDB();


// app.use()
app.use(cors());
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

// routes
app.use('/api/user/',require('./routes/user/user-routes'));
app.use('/api/user/profile',require('./routes/user/profile-routes'));
app.use('/api/user/health',require('./routes/user/health-routes'));
app.use('/api/user/primarytest',require('./routes/user/primarytest-routes'))

// admin routes
app.use('/api/admin/',require('./routes/admin/admin-routes'));
app.use('/api/admin/requests',require('./routes/admin/request-routes'));


// bloodBank routes
app.use('/api/bloodBank',require('./routes/bloodBank/bloodBank-routes'));

//hospital routes
app.use('/api/hospital',require('./routes/hospital/hospital-routes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`Server started on port ${PORT}`)); 