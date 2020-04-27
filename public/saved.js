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
