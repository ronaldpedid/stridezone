/**
 * Created by ronal on 5/19/2017.
 */
const mongoose = require('mongoose');
const deckSchema = new mongoose.Schema({
    deckName: {
        type: String,
        required: false
    },
    deckList: {
        type: Array,
        required: false
    }
});

const Deck = mongoose.model('Deck', deckSchema);
module.exports = Deck;
module.exports.schema = deckSchema;