const Note = require('../models/noteModel');




    var post =  [
        {
        title: 'title 1',
        text: 'text bhjgjhgjhd djfgdhfjgd'
        },
        {
        title: 'title 2',
        text: '5 second text bhjgjhgjhd djfgdhfjgd'
        }
    ]

exports.getAllNotes = (req, res) => {

    res.send(post); 
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
            time: req.time(),
            data: {
                note: newNote
            }
        });
    } catch {
        res.status(404).json({
            status: 'fail',
            message: 'Invalid data sent!'
        });
    }
}
exports.getNote = (req, res) => {
    res.send({
        status: 'okay',
        time: req.time
})
}

exports.updateNote = (req, res) => {
    res.send({
        status: 'okay',
        time: req.time
})
}