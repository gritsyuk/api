const User = require('../models/userModel');
const util = require('util');
const sendEmail = require('../utils/email');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const jwt = require('jsonwebtoken');

const signToken = id => {
    return jwt.sign({id: id}, process.env.JWT_SECRET, {expiresIn: '30d'});
}

exports.signup = catchAsync(async (req, res, next) => {
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            photo: req.body.photo,
            passwordConfirm: req.body.passwordConfirm
        });
        
        const token = signToken(newUser._id);

        res.status(201).json({
            status: 'success',
            token,
            data: {
                user: newUser
            }
        });

});

exports.login = catchAsync(async (req, res, next) => {
    const {email, password} = req.body;

    //1) Check is email and password exist
    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }
    //2) Check is user exist && password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    //3) If everything ok, send token to client
    
    const token = signToken(user._id);
    res.status(201).json({
        status: 'success',
        token
    });

});

exports.protect = catchAsync(async (req, res, next) => {
    // 1) Getting token and check of it's there
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(
            new AppError('You are not logged in! Please log in to get access.', 401)
            );
    }

    // 2) Verification token
    const verifyToPromise = util.promisify(jwt.verify);
    const decode = await verifyToPromise(token, process.env.JWT_SECRET);

    // 3) Check if user still exists   
    const currentUser = await User.findById(decode.id); 
    if(!currentUser) {
        return next(
            new AppError('The user belonging to this token does no longer exist', 401)
        );
    }

   // 4) Check if user changed password after the token was issued
   if (currentUser.changedPasswordAfter(decode.iat)) {
    return next(
        new AppError('User recently changed password! Please log in again.', 401)
    );   
   }
   req.user = currentUser;

   next();
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        //roles ['admin', 'lead-guide'] role = 'user'
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }

        next();
    }
}

exports.forgotPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on POSTed email
    const user = await User.findOne({email: req.body.email});
    if (!user) {
        return next(new AppError('The is no user with email address', 404));
    }

    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false }); 
    
    // 3) Send it to user's email
    const resetURL = `${req.protocol}://${req.get('host'
    )}/api/vi/users/resetPassword/${resetToken}`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'You password reset token (valid for 10 min)',
            message: resetURL
        });

        res.status(200).json({
            status: 'success',
            message: 'Token send to email!'
        });

    } catch(err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({validateBeforeSave: false});
        
        return next(new AppError('There was an error sending the email. Try again later',
         500)
        );
    }


});

exports.resetPassword = (req, res, next) => {};
