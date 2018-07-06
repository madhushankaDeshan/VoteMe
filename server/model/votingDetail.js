
var mongoose = require('mongoose');

var VotingDetail = mongoose.model('VotingDetail',{
    _contestantId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    _voterId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

module.exports = {VotingDetail};

