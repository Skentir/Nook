$(document).ready(function(){
    console.log("Inside file")
    $(".check").click(function(){
        var $addBtn = $(this);
        var id = $addBtn.data('id');

        console.log("Check me " + id);
        
        $.ajax({
            type: "PUT",
            url: "/admin/accept-request/"+ id,  
            success: function (data) {
               console.log("Added to user's organizations")
            }               
        });

        $.ajax({
            type: "DELETE",
            url: "/admin/delete-request/"+ id,  
            success: function (data) {
               var string = '#' + id;
            $(string).remove(); 
            }               
        });


       var string = '#' + id;
        $(string).remove(); 
       return false;
    });

    $(".reject").click(function(){
        var $deleteBtn = $(this);
        var id = $deleteBtn.data('id');

        console.log("Delete me " + id)

        $.ajax({
            type: "DELETE",
            url: "/admin/delete-request/"+ id,  
            success: function (data) {
               var string = '#' + id;
        $(string).remove(); 
            }               
        });

        return false;
    });
})
