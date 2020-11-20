const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

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
    photo: String, 
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
}
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

const User = mongoose.model('User', userSchema);

module.exports = User;


