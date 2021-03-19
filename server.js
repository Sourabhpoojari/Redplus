const express = require('express'),
        app = express(),
     connectDB = require('./config/db'),
     bodyParser = require('body-parser');


// DB connection
connectDB();


// app.use()
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

// routes
app.use('/api/user/',require('./routes/user/user-routes'));
app.use('/api/bloodbank/',require('./routes/bloodbank/bloodbank-routes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`Server started on port ${PORT}`)); 