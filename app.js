const express = require('express');
const mongoose = require('mongoose'); 
const app = express();
const morgan = require('morgan');
const noteRouters = require('./routes/noteRouters');
const userRouters = require('./routes/userRouters');
const AppError = require('././utils/appError');
const errorController = require('./controllers/errorController');
// const Msg = require('./models/messageModel');


const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})
.then(() => {
    console.log("Successful connect to database");
}, ()=>{console.log("Error: Error connect to database")});

// parse application/json
app.use(express.json());
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.get("/", (req, res)=>{
    res.send("Hi");
});

// const newMsg = new Msg({
//     username : 'Jon',
//     message: 'Fers comments'
// });

// newMsg.save().then(doc => {
//     console.log(doc);
// }).catch(err => {
//     console.log('ERROR: ', err);
// })


console.log(process.env.DBUSER);
// app.use((req, res, next)=>{
//     console.log(Date.now());
//     req.time = new Date().toISOString(); 
//     next()
// });


app.use('/api/v1/notes', noteRouters);
app.use('/api/v1/users', userRouters);

app.all('*', (req, res, next) => {
    // let err = new Error(`Can't find ${req.originalUrl} on server`);
    // err.statusCode = 404;
    // err.status = "fail";
    next(new AppError(`Can't find ${req.originalUrl} on server`, 404));
});

app.use(errorController);

module.exports = app;

