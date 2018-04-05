const express  = require('express');
const app      = express();
const router   = express.Router();
const port     = process.env.PORT || 3000;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path       = require('path');
const cors       = require('cors');
const config   = require('./config/database');
const authentication   = require('./routes/authentication')(router);

//middlewares
app.use(cors({
    origin: 'http://localhost:4200'
}));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true})); // for parsing application/x-www-form-urlencoded
app.use(express.static(__dirname + '/client/dist/')); // access to static location
app.use('/authentication', authentication);

mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err) => {
    if(err){
        console.log('Not connected to the database ' + err);
    }else{
        console.log('Successfully connected to MongoDB');
    }   
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/dist/index.html'));
});

app.listen(port, () => console.log('Example app listening on port 3000!'))