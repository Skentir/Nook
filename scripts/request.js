$(document).ready(function(){

    function isValid(field, val) {
        var valid = val;
        if(field.val() == "") {
            valid = false;
        }
        return valid;
    }

    $(".check").click(function() {
        var $addBtn = $(this);
        var id = $addBtn.data('id');
        
        $.ajax({
            type: "PUT",
            url: "/admin/accept-request/"+ id,              
        }).done(function (data) {
            var string = '#' + id;
            $(string).remove(); 
        })
        .fail(function()  {
            alert("Sorry. Server unavailable. ");
        }); 

        return false;
    });

    $(".reject").click(function(){
        var $deleteBtn = $(this);
        var id = $deleteBtn.data('id');

        $.ajax({
            type: "DELETE",
            url: "/admin/delete-request/"+ id,            
        }).done(function (data) {
            var string = '#' + id;
            $(string).remove(); 
        })
        .fail(function()  {
            alert("Sorry. Server unavailable. ");
        }); 

        return false;
    });

    $(".cancel").click(function() {
        var $deleteBtn = $(this);
        var id = $deleteBtn.data('id');

        $.ajax({
            type: "DELETE",
            url: "/cancel-request/" + id,       
        }).done(function (data) {
            var string = '#request-' + id;
             $(string).remove(); 
        })
        .fail(function()  {
            alert("Sorry. Server unavailable. ");
        });

       return false;
    });

    $("#create-request-form").submit(function() {
        event.preventDefault();
        var org = $('#org-name-field').val();
        var pos = $('#req-position').val();

            console.log("Req fields valid.")

            new_request = {
                org_name: org,
                position: pos
            }

            $.ajax({
                type: "POST",
                url: "/edit-profile/create-request",  
                data: new_request,
            }).done( function (msg) {
                console.log("message"+msg);
                console.log("Done creating! Adding to CSS ... ")
                // Close the modal
                $('#add-request-modal').modal('toggle');
                orgName = org.replace(/\s/g, '+')
                // Get the org assets of new request
                $.ajax({
                    type: "GET",
                    url: "/search-results?org_name="+orgName+"&type=2",  
                    dataType: 'json'
                }).done( function (data) {
                console.log("Request assets retrieved!")  
                var string = 
                `<div class="row request-item" id="request-`+data._id+`">
                    <span class="col-9 request-org-cell">
                        <img class="hdr-pic request-org-pic" src=`+data.img+`>
                        <p class="request-org-name">`+data.org_name+`</p>
                    </span>
                    <div class="col-3 cancel-req">
                        <button style="color:red; border:0px; background-color:white" class="cancel" data-id="{{this._id}}">Cancel</button>
                    </div>
                 </div>`
                // Add to list
                $(string).insertBefore('#request-list a');
                })
                .fail(function()  {
                    alert("Sorry. Server unavailable. ");
                });
            })
            .fail(function()  {
                alert("Sorry. Server unavailable. ");
            }); 
        return false;
    })
})
