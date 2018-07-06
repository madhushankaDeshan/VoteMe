
var mongoose = require('mongoose');

var Voter = mongoose.model('Voter',{
    votingType: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    gender: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    }
});


module.exports = {Voter};
