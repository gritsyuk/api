
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

exports.getAllNotes = (req, res)=>{

    res.send(post); 
}

exports.addNote = (req, res)=>{
    console.log(req.body);
    post.push(req.body);
    res.send({
        status: 'okay',
        time: req.time
})
}
exports.getNote = (req, res)=>{
    res.send({
        status: 'okay',
        time: req.time
})
}

exports.updateNote = (req, res)=>{
    res.send({
        status: 'okay',
        time: req.time
})
}

