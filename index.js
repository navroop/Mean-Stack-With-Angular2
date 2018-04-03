const express  = require('express');
const app      = express();
const port     = process.env.PORT || 3000;
const mongoose = require('mongoose');
var path       = require('path');
const config   = require('./config/database');

app.use(express.static(__dirname + '/client/dist/')); // access to static location

mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err) => {
    if(err){
        console.log('Not connected to the database ' + err);
    }else{
        console.log('Successfully connected to MongoDB');
    }   
});

app.get('*', function(req, res){
    res.sendFile(path.join(__dirname + '/client/dist/index.html'));
});

app.listen(port, () => console.log('Example app listening on port 3000!'))