$(document).ready(function(){
    $("#add-to-planner-btn").click(function() {
        var url = window.location.pathname;
        var id = url.substring(url.lastIndexOf('/') + 1);

        $.ajax({
            type: "POST",
            url: "/add-to-planner/"+ id,              
        }).done(function (data) {
            $('#add-to-planner-modal').modal('toggle');
        })
        .fail(function()  {
            alert("Sorry. Server unavailable. ");
        });
   });
})