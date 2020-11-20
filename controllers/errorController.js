const AppError = require("../utils/appError");

const handleCastErrorDB = (err) => {
    const message = `Invaild ${err.path}: ${err.value}`;
    return new AppError(message, 400);
}
const handleExistErrorDB = (err) => {
    // const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value: x Please use another value!`;
    console.log(value);
    return new AppError(message, 400);
}
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

const sendErrorProd = (err, res) => {
    //Operational, trusted error: send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    // Programming or other unknown error: don't leak error details      
    } else {
    //1) Log error
    console.error('ERROR ', err);
    //2 Send generic message    
    res.status(500).json({
        status: 'error',
        message: 'Something went very wrong!'
    });
    }
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = {...err};
        if (error.name === 'CastError') error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleExistErrorDB(error); //stop 07112020
        sendErrorProd(error, res);
    } 
}