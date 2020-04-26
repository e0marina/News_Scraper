// TO DO:
// Users should also be able to leave comments on the articles displayed and revisit them later. The comments should be saved to the database as well and associated with their articles. Users should also be able to delete comments left on articles. All stored comments should be visible to every user.

// DONE make sure duplicate entries aren't being saved to db when scrape happens

// * Don't just clear out your database and populate it with scraped articles whenever a user accesses your site.

//   * If your app deletes stories every time someone visits, your users won't be able to see any comments except the ones that they post.
////////////////////////////////////////////////////////

// Grab the articles as a json
$.getJSON("/articles", function (data) {
  // first empty the divs
  $("#articles").empty();
  // debugger;
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the information on the page
    $("#articles").prepend(
      "<p data-id='" +
        data[i]._id +
        "'>" +
        data[i].title +
        "<br />" +
        "<br />" +
        data[i].link +
        "</p>" +
        "<br />" +
        "<hr>"
    );
  }
});

// Whenever someone clicks a p tag
$(document).on("click", "p", function () {
  // Empty the comments from the comments section
  $("#comments").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId,
  })
    // With that done, add the comment information to the page
    .then(function (data) {
      console.log(data);
      // The title of the article
      $("#comments").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#comments").append("<input id='titleinput' name='title'>");
      // A textarea to add a new comment body
      $("#comments").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new comment, with the id of the article saved to it
      $("#comments").append(
        "<button data-id='" +
          data._id +
          "'id='savecomment'>Save comment</button>"
      );

      // If there's a comment in the article
      if (data.comment) {
        // Place the title of the comment in the title input
        $("#titleinput").val(data.comment.title);
        // Place the body of the comment in the body textarea
        $("#bodyinput").val(data.comment.body);
      }
    });
});

// When you click the savecomment button
$(document).on("click", "#savecomment", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the comment, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from comment textarea
      body: $("#bodyinput").val(),
    },
  })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
      // Empty the comments section
      $("#comments").empty();
    });

  // Also, remove the values entered in the input and textarea for comment entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
