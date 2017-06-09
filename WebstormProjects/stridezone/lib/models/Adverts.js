var mongoose = require('mongoose');
var advertSchema = new mongoose.Schema({
    topAd:{
        type: String
    },
    botAd:{
      type: String
    }

});

var Advert = mongoose.model('Advert', advertSchema);
module.exports = Advert;
module.exports.schema = advertSchema;