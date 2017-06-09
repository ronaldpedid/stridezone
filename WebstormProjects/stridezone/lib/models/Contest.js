var mongoose = require('mongoose');
var contestSchema = new mongoose.Schema({
    entry:{
        type: String,
        required: false
    }
});

var Contest = mongoose.model('Contest', contestSchema);
module.exports = Contest;
module.exports.schema = contestSchema;