////////////////////////////////////////////////////////

//on page load will see articles, may not be the latest

// Grab the articles as a json
$.getJSON("/articles", function (data) {
  // first empty the div
  $("#articles").empty();

  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the information on the page
    $("#articles").prepend(
      "<div class='card' data-id='" +
        data[i]._id +
        "'>" +
        "<div class='card-header'>" +
        data[i].title +
        "</div>" +
        "<div class='card-body'>" +
        "<p class='card-text'>" +
        data[i].link +
        "</p>" +
        "</div>" +
        "<a href='" +
        data[i]._id +
        "' class='btn btn-primary' id='save-art'>" +
        "Save Article" +
        "</a>" +
        "</div>" +
        "</div>" +
        "</br>" +
        "</br>"
    );
  }
});

//get/scrape latest articles
$("#scraper-btn").on("click", function (event) {
  handleArticleScrape();
});

function handleArticleScrape() {
  // This function handles the user clicking "scrape new article" button
  $.get("/scrape").then(function (data) {
    //reload page
    window.location.reload();
  });
}

//logic for storing saved articles in local storage
var savedArticle;
// var savedArtArr = [];

$("#save-art").on("click", function (e) {
  // Store clicked on article into localStorage
  savedArticle = $(this).parents(".card");

  console.log(savedArticle);

  localStorage.setItem("saved", savedArticle);
});
