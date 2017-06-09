var mongoose = require('mongoose');
var postSchema = new mongoose.Schema({
    postTitle: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    imagePath: {
        type: String,
        required: false
    },
    imagePath1:{
        type: String,
        required: false
    },
    imagePath2:{
        type: String,
        required: false
    },
    facebookURL: {
      type: String,
      required: false
    },
    startTime: {
        type: Date,
        required: false
    },
    updatedAt:{
        type: Date,
        default: Date.now
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    isPremium:{
        type: String,
        required: false
    },
    isFeatured:{
        type: String,
        required: false
    }


});

var Post = mongoose.model('Post', postSchema);
module.exports = Post;
module.exports.schema = postSchema;