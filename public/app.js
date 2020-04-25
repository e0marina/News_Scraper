// TO DO:
// Users should also be able to leave comments on the articles displayed and revisit them later. The comments should be saved to the database as well and associated with their articles. Users should also be able to delete comments left on articles. All stored comments should be visible to every user.
// DONE Make it so most recent articles are at the top (if possible)
// make sure duplicate entries aren't being saved to db when scrape happens
//make it so when doc loads, scrape happens and then pages shown

// * Don't just clear out your database and populate it with scraped articles whenever a user accesses your site.

//   * If your app deletes stories every time someone visits, your users won't be able to see any comments except the ones that they post.

// Grab the articles as a json
$.getJSON("/articles", function (data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the information on the page
    $("#articles").prepend(
      "<p data-id='" +
        data[i]._id +
        "'>" +
        data[i].title +
        "<br />" +
        data[i].link +
        "</p>"
    );
  }
});
