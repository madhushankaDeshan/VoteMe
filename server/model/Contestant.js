
var mongoose = require('mongoose');

var Contestant = mongoose.model('Contestant',{
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    image: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    voteCount: {
        type: Number,
        default:0

    },
    _contestId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});


module.exports = {Contestant};
