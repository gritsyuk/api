const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name!']
    },
    email : {
        type: String,
        required: [true, 'Please provide your email'],
        lowercase: true,
        unique: true,
        validate: [validator.isEmail, 'Please provide a valid email'],
            // validator: function(email) {
            //     return validator.isEmail(email);
            // message: 'Please provide a valid email'
    },
    photo: String, 
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please provide your password'],
        minlength: [8, "Password length more than 8 "],
        //select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confim youre password'],
        validate: {
            validator: function(el) {
                return this.password === el;
            },
            message: 'Password are not the same!',
        }
    },
    passwordChangedAt : Date,
    passwordResetToken: String,
    passwordResetExpires: Date 
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.correctPassword = async function(
    inputPassword, 
    userPassword
    ) {
    return await bcrypt.compare(inputPassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTiat) {
    if (this.passwordChangedAt) {
        const timestamp = parseInt(this.passwordChangedAt.getTime()/1000, 10);
        return timestamp < JWTiat; 
    }
    return false;
};

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

     this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
     //console.log(this.passwordResetToken);
     return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;


