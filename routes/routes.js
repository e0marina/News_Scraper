var db = require("../models");
// var path = require("path");
var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function (app) {
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
    // save the new comment that gets posted to the Comments collection
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

  // Route for grabbing a specific comment by id
  app.get("/comment/:id", function (req, res) {
    db.Comment.findById(req.params.id)

      .then(function (dbArticle) {
        // If all Comments are successfully found, send them back to the client
        res.json(dbArticle);
      })
      .catch(function (err) {
        // If an error occurs, send the error back to the client
        res.json(err);
      });
  });
};
