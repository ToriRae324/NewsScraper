var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    //* Headline - the title of the article
    //* Summary - a short summary of the article
    //* URL - the url to the original article
    //* Feel free to add more content to your database (photos, bylines, and so on).

    headline: {
        type: String,
        unique: true,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    },
    comments: [
            {
                // Store ObjectIds in the array
                type: Schema.Types.ObjectId,
                // The ObjectIds will refer to the ids in the Note model
                ref: "Comment"
            }
        ]
    
})

var Article = mongoose.model("Article", ArticleSchema);
module.exports = Article;