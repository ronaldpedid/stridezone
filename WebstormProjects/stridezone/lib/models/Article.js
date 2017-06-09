var mongoose = require('mongoose');
var articleSchema = new mongoose.Schema({
    articleTitle: {
        type: String,
        required: true
    },
    articleAuthor: {
        type: String,
        required: true
    },
    articleContent: {
        type: String,
        required: false
    },
    articleHeaderImg:{
        type: String,
        required: false
    },
    articleSideImage:{
        type: String,
        required: false
    },
    articleImage1:{
        type: String,
        required: false
    },
    articleImage2:{
        type: String,
        required: false
    },
    articleImage3:{
        type: String,
        required: false
    }
});



var Article = mongoose.model('Article', articleSchema);
module.exports = Article;
module.exports.schema = articleSchema;