$(document).on("click", ".submitComment", function(){
    event.preventDefault();

    const id = $(this).data("_id");
    const commentText = $(this).parent().children().children(".commentText").val();

    console.log("comment: ", commentText, " -- id: ", id);

    $.ajax({
        method: "POST",
        url: "/articles/" + id,
        data: {
            comment: commentText
        }
    }).then(function (newComment) {
        $(".commentText").val("");

        // var html =
        // `<p><span class="delete" data-id=${newComment._id}>x</span>${newComment.commentText}</p>`;
        // $("#"+newComment.).prepend(html);

        // location.reload();
    });
})