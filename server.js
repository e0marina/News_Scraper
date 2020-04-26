require("dotenv").config();
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

// // Connect to the Mongo DB
// mongoose.connect("mongodb://localhost/newsScraperDB", {
//   useNewUrlParser: true,
// });

////////////////////////
//Routes
////////////////////////

//a GET route for scraping the  website
app.get("/scrape", function (req, res) {
  axios.get("https://www.laist.com").then(function (response) {
    var $ = cheerio.load(response.data);

    $("a.the-latest-list__link").each(function (i, element) {
      var result = {};
      result.title = $(this).text();
      result.link = $(this).attr("href");
      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function (dbArticle) {
          // View the added result in the console//
          console.log(dbArticle);
        })
        .catch(function (err) {
          // If an error occurred, log it
          console.log(err);
        });
    });
    // Send a message to the client
    res.send("Scrape Complete");
  });
});

// Route for getting all Articles from the db
app.get("/articles", function (req, res) {
  // TODO: Finish the route so it grabs all of the articles
  db.Article.find({})
    .then(function (dbArticle) {
      // If all Notes are successfully found, send them back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurs, send the error back to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's comment
app.get("/articles/:id", function (req, res) {
  // TODO
  // ====
  db.Article.findById(req.params.id)
    .populate("comment")
    .then(function (dbArticle) {
      // If all Comments are successfully found, send them back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurs, send the error back to the client
      res.json(err);
    });
  // Finish the route so it finds one article using the req.params.id,
  // and run the populate method with "comment",
  // then responds with the article with the comment included
});

// Route for saving/updating an Article's associated Comment
app.post("/articles/:id", function (req, res) {
  // save the new note that gets posted to the Comments collection
  // then find an article from the req.params.id
  // and update it's "comment" property with the _id of the new comment
  db.Comment.create(req.body)
    .then(function (dbComment) {
      return db.Article.findOneAndUpdate(
        { _id: req.params.id },
        { comment: dbComment._id }, //this does one single comment as opposed to $push for multi notes for a user
        { new: true }
      );
    })
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});
