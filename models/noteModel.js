const mongoose = require('mongoose');
const slugify = require('slugify');

const noteSchema = new mongoose.Schema({
    title : {
        type: String,
        trim: true,
        require: [true, 'A Note must have a name'],
        unique: true,
        maxlength: [80, "Название заметки содержить более 80 символов"],
        minlength: [10, "Название заметки содержить менее 10 символов"]
    },
    slug: String,
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
    },
    secret_note: {
        type: Boolean,
        default: false
    }
}
);

noteSchema.pre('save', function(next) {
    this.slug = slugify(this.title, {lower : true});
    next();
});

noteSchema.pre(/^find/, function(next) {
    // noteSchema.pre('find', function(next) { findOne ...
this.find({secret_note: {$ne : true}})
    next();
})

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;


