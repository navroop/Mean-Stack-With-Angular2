const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const bcrypt = require('bcrypt-nodejs');

let emailLengthChecker = (email) => {
    if(!email){
        return false;
    } else {
        if(email.length < 5 || email.length > 30){
            return false;
        } else {
            return true;
        }
    }
}

let validEmailChecker = (email) => {
    if(!email){
        return false;
    } else {
        const regExp = new RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
        return regExp.test(email);
    }
}

let usernameLengthChecker = (username) => {
    if(!username){
        return false;
    } else {
        if(username.length < 3 || username.length > 15){
            return false;
        } else {
            return true;
        }
    }
}
let validUsernameChecker = (username) => {
    if(!username){
        return false;
    } else {
        const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
        return regExp.test(username);
    }
}

const emailValidators = [
    {
        validator: emailLengthChecker,
        message: 'Email must be at least 5 characters but no more than 30'
    },{
        validator: validEmailChecker,
        message: 'Must be valid email.'
    }
]

const usernameValidators = [
    {
        validator: usernameLengthChecker,
        message: 'Email must be at least 3 characters but no more than 15'
    },{
        validator: validUsernameChecker,
        message: 'Username must not have any special character'
    }
]



const UserSchema = new Schema({ 
    username: {type: String, lowercase: true, required: true, unique: true, validate: usernameValidators},
    password: {type: String, required: true},
    email: {type: String, lowercase: true, required: true, unique: true, validate: emailValidators},
    phonenumber: {type: String, required: true},
    terms : {type: Boolean, required: true},
});

//middleware encrypt the password
UserSchema.pre('save', function (next){
    var user = this;
    if(!user.isModified('password'))
    return next();
    bcrypt.hash(user.password, null, null, function(err, hash) {
        // Store hash in your password DB.
        if(err) return next(err);
            user.password = hash;
            next();
    });
});
// decrypt the password and compare it. Return true or false
UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}


module.exports = mongoose.model('User', UserSchema);