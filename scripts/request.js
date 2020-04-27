$(document).ready(function(){

    $(".check").click(function() {
        var $addBtn = $(this);
        var id = $addBtn.data('id');

        console.log("Check me " + id);
        
        $.ajax({
            type: "PUT",
            url: "/admin/accept-request/"+ id,  
            success: function (data) {
               console.log("Added to user's organizations");
               var string = '#' + id;
               $(string).remove(); 
            }               
        });
        /*
        $.ajax({
            type: "DELETE",
            url: "/admin/delete-request/"+ id,  
            success: function (data) {
               var string = '#' + id;
                $(string).remove(); 
            }               
        });
        */

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

    $(".cancel").click(function() {
        var $deleteBtn = $(this);
        var id = $deleteBtn.data('id');

        console.log("Cancel me " + id);

        $.ajax({
            type: "DELETE",
            url: "/admin/delete-request/"+ id,  
            success: function (data) {
               var string = '#request-' + id;
                $(string).remove(); 
            }               
        });

       return false;
    });

    /*
    $("#add-req-btn").click(function() {
        Get get input 
        data_Z = {
            org_name: jafiejf
            position: fjaefoafka
        }
         $.ajax({
            type: "POST",
            url: "/aokfaefjw",  
            data: data_Z
            success: function (data) {
               console.log("SUccEssfully created a requset")
            }               
        });


    })
    */
})
