
var mongoose = require('mongoose');

var Contest = mongoose.model('Contest',{
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    startDate: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    endDate: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    _adminId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

module.exports = {Contest};
