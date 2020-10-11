const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    title : {
        type: String,
        unique: true
    },
    author: {
        type: String
    },
    create_date: {
        type: Date,
        default: new Date()
    },
    edit_date: {
        type: Date,
    },
    body: {
        type: String
    },
    tags : {
        type: Array
    }
}
);

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;


