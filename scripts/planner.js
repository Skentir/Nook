$(document).ready(function(){
   
    $("#add-to-planner-btn").click(function() {
        var id = $(this).data('id');
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