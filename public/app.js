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
        "<a href='#' class='btn btn-primary' id='save-art'>" +
        "Save Article" +
        "</a>" +
        "</br>" +
        "<a href='#' data-id='" +
        data[i]._id +
        "' class='btn btn-primary' id='leave-comment'>" +
        "Leave a Comment" +
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

  savedArticle = $(this).parent(".card");

  localStorage.setItem("saved", JSON.stringify(savedArticle));
});

//////////////////////////////////////////////////////////////////////////
// COMMENTS
//////////////////////////////////////////////////////////////////////////
//when leave a comment button clicked

$(document).on("click", "#leave-comment", function () {
  // console.log("this is happening");
  //grab the id associated with the article user wants to leave comment under
  var commentId = $(this).attr("data-id");
  var commentSection = $(this).parent();
  // console.log(commentId);

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + commentId,
  }).then(function (data) {
    // console.log(data);
    $("#leave-comment").hide();
    //textbox and button appear under the button clicked
    commentSection.append(
      "<br>" +
        "<form>" +
        "<div class='form-group'>" +
        "<label for='comment-text-box'>" +
        "" +
        "</label>" +
        "<textarea class='form-control' id='bodyInput' rows='3'>" +
        "</textarea>" +
        "</div>" +
        "<button type='submit' class='btn btn-primary' id='saveComment' data-id='" +
        commentId +
        "'>" +
        "Submit" +
        "</button>" +
        "</form>" +
        "<br>"
    );
  });
});

// When you click the savecomment button
$(document).on("click", "#saveComment", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  console.log(thisId);

  // Run a POST request to create the comment, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from comment textarea
      body: $("#bodyInput").val(),
    },
  })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
    });

  // Also, remove the values entered in the input and textarea for comment entry

  $("#bodyInput").val("");
});
