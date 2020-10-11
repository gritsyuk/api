const mongoose = require('mongoose');

const msgSchema = new mongoose.Schema({
    username : {
        type: String,
        unique: true
    },
    message: {
        type: String
    }
}
);

const Msg = mongoose.model('Msg', msgSchema);

module.exports = Msg;


