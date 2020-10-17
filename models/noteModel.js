const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    title : {
        type: String,
        trim: true,
        require: [true, 'A Note must have a name'],
        unique: true
    },
    author: {
        type: String,
        trim: true
    },
    create_date: {
        type: Date,
        default: Date.now()
    },
    edit_date: {
        type: Date,
    },
    body: {
        type: String,
        trim: true
    },
    tags : [String],
    rating: {
        type: Number,
        default: 0
    }
}
);

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;


