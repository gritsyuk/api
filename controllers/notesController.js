const Note = require('../models/noteModel');
const ApiFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');


exports.getAllNotes = catchAsync(async (req, res, next) => {
        let features = new ApiFeatures(Note.find(), req.query)
        .find()
        .sort()
        .select()
        .pagination();

        const notes = await features.query;

        res.status(200).json({
            status: "success",
            results: notes.length,
            data: {
                notes
            }
        });

});

exports.addNote = catchAsync(async (req, res, next) => {
        const newNote = await Note.create(req.body);
        
        res.status(201).json({
            status: 'success',
            data: {
                note: newNote
            }
        });

});

exports.getNote = catchAsync(async (req, res, next) => {
    const note = await Note.findById(req.params.id); //findOne({_id: req.params.id})

    if (!note) {
        return next(new AppError(`Can't find note with this ID: ${req.params.id}`, 404))
    }
    res.status(201).json({
        status: 'success',
        data: {
            note
        }
    });
});

exports.updateNote = catchAsync(async (req, res, next) => {
        const note = await Note.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }); 

        if (!note) {
            return next(new AppError(`Can't find note with this ID: ${req.params.id}`, 404))
        }

        res.status(204).json({
            status: 'success',
            data: {
                note
            }
        });
});

exports.deleteNote = catchAsync(async (req, res, next) => {
        const note = await Note.findByIdAndDelete(req.params.id); 

        if (!note) {
            return next(new AppError(`Can't find note with this ID: ${req.params.id}`, 404))
        }
        res.status(204).json({
            status: 'success',
            data: null
        });
});