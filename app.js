const express = require('express');
const mongoose = require('mongoose'); 
const app = express();
const morgan = require('morgan');


const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})
.then(() => {
    console.log("Successful connect to database");
}, ()=>{console.log("Error: Error connect to database")});
const noteRouters = require('./routes/noteRouters');
// parse application/json
app.use(express.json());
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.get("/", (req, res)=>{
    res.send("Hi");
})
console.log(process.env.DBUSER);
// app.use((req, res, next)=>{
//     console.log(Date.now());
//     req.time = new Date().toISOString(); 
//     next()
// });


app.use('/api/v1/notes', noteRouters);


module.exports = app;

