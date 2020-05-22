$(document).ready(function(){
    $(".delete-event").click(function() {
        var $deleteBtn = $(this);
        var id = $deleteBtn.data('id');
        
        $.ajax({
            method: "DELETE",
            url: "/admin/delete-event/" + id,       
        }).done(function (data) {
            var string = '#event-' + id;
             $(string).remove(); 
        })
        .fail(function()  {
            alert("Sorry. Server unavailable. ");
        });

       return false;
    });
})

