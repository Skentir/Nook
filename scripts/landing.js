$(document).ready(function(){

    $("#sign-in-btn").click(function(){
        
        //boolean 
        var valid = true;

        valid = checkifValid($("#user-id"),valid);
        valid = checkifValid($("#user-pass"),valid);

        if(valid == true){
            location.href = "explore.html";
        }
    })

    $("#register-btn").click(function(){

        //boolean 
        var valid = true;

        valid = checkifValid($("#reg-fname"),valid);
        valid = checkifValid($("#reg-lname"),valid);
        valid = checkifValid($("#reg-email"),valid);
        valid = checkifValid($("#reg-idnum"),valid);
        valid = checkifValid($("#reg-pass"),valid);
        valid = checkifValid($(".custom-select"),valid);
        

        if(valid == true){
            location.href = "explore.html";
        }
    })

    function checkifValid(field,val){
        var check = val;
        if(field.val() ==""){
            check = false;
            field.css({"border":"1px solid red"})
        }
        if(field.attr("class") =="custom-select"){
            if(field.val() == "Select"){
                heck = false;
                field.css({"border":"1px solid red"}) 
            }
        }

        return check;
    }

    var officerStatus = function () {
        if ($("#is-officer").is(":checked")) {
            $('#select-org').show()
        }
        else {
            $('#select-org').hide();
        }
      };
      $(officerStatus);
      $("#is-officer").change(officerStatus);
    
});