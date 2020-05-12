import { nextTick } from "async";

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
        });

       return false;
    });

    // var name = $('#event-name-field').val();
    $("#add-req-btn").click(function() {
        var valid = true;

        valid = isValid($("#org-list"),valid);
        valid = isValid($("#req-position"),valid);
        
        if(valid) {
            var org = $('#org-list').val();
            var pos = $('#req-position').val();
            
            new_request = {
                org_name: org,
                position: pos
            }
            $.ajax({
                type: "POST",
                url: "/editprofile",  
                data: new_request,
            }).done( function (data) {
                $('#add-request-modal').modal('toggle');
                var string = 
                `<div class="row request-item" id="request-{{this._id}}">
                    <span class="col-9 request-org-cell">
                        <img class="hdr-pic request-org-pic" src="{{this.org_id.0.org_logo}}">
                        <p class="request-org-name">{{this.org_id.0.org_name}}</p>
                    </span>
                    <div class="col-3 cancel-req">
                        <button style="color:red; border:0px; background-color:white" class="cancel" data-id="{{this._id}}">Cancel</button>
                    </div>
                 </div>`
                $('#requestlist').append(string)
                res.redirect('editprofile');
            })
        }
        else {
            
        }
        
        location.reload();
        return false;
    })
})
