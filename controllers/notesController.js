const Note = require('../models/noteModel');

exports.getAllNotes = async (req, res) => {
    try {

        const queryObj = {...req.query};
        const exclude = ['page', 'limit', 'sort'];
        console.log(queryObj);
        exclude.forEach((item) => delete queryObj[item]);

        let queryString = JSON.stringify(queryObj);
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        console.log(JSON.parse(queryString));
        let query = Note.find(JSON.parse(queryString));

        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query.sort(sortBy);
        } else {
            query.sort('-create_date');
        }

        const notes = await query;

        res.status(200).json({
            status: "success",
            results: notes.length,
            data: {
                notes
            }
        });
    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: err
        });

    }
}

exports.addNote = async (req, res) => {
    // const createNote = new Note({
    //     title : 'My third Note',
    //     author: 'Igor Gritsyuk',
    //     body: 'Разработка и производство противоугонных систем. Новый подход к устройствам защиты автомобиля!',
    //     tags : ['one', 'two', 'thre']
    // });
    // createNote.save().then(res => {
    //     console.log(res);
    // }).catch(err => {
    //     console.log(err);
    // });
    try {
        const newNote = await Note.create(req.body);
        
        res.status(201).json({
            status: 'success',
            data: {
                note: newNote
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: 'Invalid data sent!'
        });
    }
};

exports.getNote = async (req, res) => {
try {
    const note = await Note.findById(req.params.id); //findOne({_id: req.params.id})
    res.status(201).json({
        status: 'success',
        data: {
            note
        }
    });
} catch (err) {
    res.status(404).json({
        status: 'fail',
        message: 'Invalid data sent!'
    });
}
};

exports.updateNote = async (req, res) => {
    try {
        const note = await Note.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }); 
        res.status(204).json({
            status: 'success',
            data: {
                note
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: 'Invalid data sent!'
        });
    }
}

exports.deleteNote = async (req, res) => {
    try {
        const note = await Note.findByIdAndDelete(req.params.id); 
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}