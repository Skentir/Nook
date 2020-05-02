$(document).ready(function(){

    $(".check").click(function() {
        var $addBtn = $(this);
        var id = $addBtn.data('id');

        console.log("Check me " + id);
        
        $.ajax({
            type: "PUT",
            url: "/admin/accept-request/"+ id,  
            done: function (data) {
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
            done: function (data) {
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
            done: function (data) {
               var string = '#request-' + id;
                $(string).remove(); 
            }               
        });

       return false;
    });

    // var name = $('#event-name-field').val();
    $("#add-req-btn").click(function() {
        var org = $('#org-list').val();
        var pos = $('#req-position').val();
        
        new_request = {
            org_name: org,
            position: pos
        }

        // console.log(new_request)

        $.ajax({
            type: "POST",
            url: "/editprofile",  
            data: new_request,
            done: function (data) {
               console.log("SUccEssfully created a requset")
            } 
        });

        return false;
    })
})
