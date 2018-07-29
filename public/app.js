$("#scrape").on("click", function(){
    $.ajax({
        method: "GET",
        url: "/scrape"
    })
    .then(function(){
        if (true) {
            console.log("Scrape Complete")
            location.reload();
        }
    })
})

    $(document).on("click", ".submitComment", function() {
        event.preventDefault();

        const id = $(this).data("id");
        const commentText = $(this).parent().children().children(".commentText").val();

        console.log("comment: ", commentText, " -- id: ", id);

        $.ajax({
            method: "POST",
            url: "/articles/" + id,
            data: {
                comment: commentText
            }
        }).then(function (newComment) {
            console.log(newComment);
            $(".commentText").val("");

            location.reload();
        });
    })

    $(document).on("click", ".delete", function(){
        const id = $(this).data("id");
        console.log(id);

        $.ajax({
            method: "DELETE",
            url: "/comments/"+ id,
        }).then(function(data){
            console.log("Comment Deleted");
            if (data === true){
                location.reload();
            }
            
        });
    })
