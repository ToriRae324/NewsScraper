var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");



var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 8080;

// Initialize Express
var app = express();


// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsScraper";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);


// function to scrape news site
const scrapeNews = function () {
    return axios.get("http://www.blacknews.com/").then(function (res) {

        var allArticles = []

        var cheer = cheerio.load(res.data);

        cheer(".post-body.entry-content").each(function (i, element) {
            // Save an empty result object
            var result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.title = cheer(this)
                .children("a")
                .attr("title");

            result.summary = cheer(this)
                .children()
                .children("p")
                .text();

            result.url = cheer(this)
                .children("a")
                .attr("href");

            result.image = cheer(this)
                .children("a")
                .children("img")
                .attr("src");

            allArticles.push(result)
        });
        return allArticles
    });
}


// API Routes

// scape the website and add to database
app.get("/scrape", function (req, res) {
    scrapeNews()
        .then(function (allArticles) {
            // add array of articles to database
            db.Article.create(allArticles);
            return res.json(true);
        })
        .catch(function (err) {
            return err;
        });
});

// get all articles with comments from database
app.get("/articles", function (req, res) {
    db.Article.find({})
        .populate("comments")
        .then(function (popArts) {
            res.json(popArts);
        })
        .catch(function (err) {
            console.log(err);
            res.json(err);
        })
});

// get one article with comments
app.get("/articles/:id", function (req, res) {
    db.Article.findById(req.params.id)
        .populate("comments")
        .then(function (popArts) {
            res.json(popArts);
        })
        .catch(function (err) {
            console.log(err);
            res.json(err);
        })
});

// post comment to article
app.post("/articles/:id", function (req, res) {
    db.Comment.create(req.body)
        .then(function (newComment) {
            return db.Article.findByIdAndUpdate(req.params.id, { $push: { comments: newComment._id } }, { new: true });
        })
        .then(function (newArticle) {
            res.json(newArticle);
        })
        .catch(function (err) {
            console.log(err);
            res.json(err);
        })
})

// delete specific comment
app.delete("/comments/:id", function (req, res) {
    db.Comment.findByIdAndRemove(req.params.id)
        .then(function () {
            console.log("Comment Removed")
            res.json(true);
        })
        .catch(function (err) {
            res.json(err);
        })
})



// HTML Routes

app.get("/", function (req, res) {
    // scrapeNews()

    db.Article.find({})
        .populate("comments")
        .then(function (popArts) {
            // console.log({ Article: popArts });
            res.render("index", { Article: popArts });;
        })
        .catch(function (err) {
            console.log(err);
            return res.json(err);
        })


})


// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});