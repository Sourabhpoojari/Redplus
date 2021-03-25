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

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`Server started on port ${PORT}`)); 