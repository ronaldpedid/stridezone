var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');


var SALT_WORK_FACTOR = 10;

var userSchema = new mongoose.Schema({
    username: {type: String, unique: true},
    password: {type: String},
    firstName: {type: String},
    lastName: {type: String},
    emailAddress: {type: String, unique: true}
});

userSchema.pre('save', function (next) {
    var user = this;
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, cb);
};

var User = mongoose.model('User', userSchema);
module.exports = User;