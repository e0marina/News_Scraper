// TO DO:
// Users should also be able to leave comments on the articles displayed and revisit them later. The comments should be saved to the database as well and associated with their articles. Users should also be able to delete comments left on articles. All stored comments should be visible to every user.

// DONE make sure duplicate entries aren't being saved to db when scrape happens

// * Don't just clear out your database and populate it with scraped articles whenever a user accesses your site.

//   * If your app deletes stories every time someone visits, your users won't be able to see any comments except the ones that they post.
////////////////////////////////////////////////////////

$(document).ready(function () {
  // Grab the articles as a json
  $.getJSON("/articles", function (data) {
    // first empty the divs
    $("#articles").empty();
    $("#comments").empty();
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
          "<br />"
      );
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

  //append the comment to the appropriate article

  // Also, remove the values entered in the input and textarea for comment entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
