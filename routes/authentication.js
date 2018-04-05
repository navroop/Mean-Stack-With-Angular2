const User = require('../models/user'); //Import user schema
const jwt = require('jsonwebtoken');
const config   = require('../config/database');

module.exports = (router) => {
    router.post('/register', (req, res) => {
        if(req.body.username &&  req.body.username ==='' || 
        req.body.username &&  req.body.username ==='' ||
        req.body.username &&  req.body.username ==='' ||
        req.body.phonenumber &&  req.body.phonenumber ==='' ||
        req.body.terms &&  req.body.terms ===''){
            res.json({success:false, message: 'All fields are mandatory'});
        }else{
            var user = new User({
                username: req.body.username,
                password: req.body.password,
                email: req.body.email,
                phonenumber: req.body.phonenumber,
                terms: req.body.terms
            });
            user.save((err) => {
                if(err) {
                    if(err.code === 11000){
                        res.json({success:false, message: 'User already exists'})
                    }else{
                        res.json({success:false, message: 'Could not save user. Error ', err})
                    }
                }else{;
                    res.json({success:true, message: 'user created'});
                }
            });
        }
    });  
    router.get('/checkemail/:email', (req, res) => {
        if (!req.params.email){
            res.json({ success:false, message: 'Email was not provided' })
        } else {
            User.findOne({ email: req.params.email }, (err, user) => {
                if(err){
                    res.json({success:false, message: err})
                } else{
                    if(user){
                        res.json({success:false, message: 'email is already taken'});
                    }else{
                        res.json({success:true, message: 'email is available'});
                    }
                }
            })
        }

    });

    router.get('/checkphonenumber/:phonenumber', (req, res) => {
        if (!req.params.phonenumber){
            res.json({ success:false, message: 'phonenumber was not provided' })
        } else {
            User.findOne({ phonenumber: req.params.phonenumber }, (err, user) => {
                if(err){
                    res.json({success:false, message: err})
                } else{
                    if(user){
                        res.json({success:false, message: 'phonenumber is already taken'});
                    }else{
                        res.json({success:true, message: 'phonenumber is available'});
                    }
                }
            })
        }

    });

    router.post('/login', (req, res) => {
        if(!req.body.username){
            res.json({ success:false, message: 'username was not provided' });
        } else {
            if(!req.body.password) {
                res.json({ success:false, message: 'password was not provided' })
            } else {
                User.findOne({ username: req.body.username.toLowerCase()}, (err, user) => {
                    if(err){
                        res.json({success:false, message: err})
                    } else{
                        if(!user){
                            res.json({ success:false, message: 'username not found' });
                        } else {
                            const validPassword = user.comparePassword(req.body.password);
                            if(!validPassword){
                                res.json({ success:false, message: 'incorrect password' });
                            } else {
                                console.log(user);
                                const token = jwt.sign({userId: user._id }, config.secret, { expiresIn: '24h'});
                                console.log(token);
                                res.json({ success: true, message: 'authenticated', token: token, user: {username: user.username} });
                            }
                        }
                    }
                })
            }
        }
    });

    return router;
}