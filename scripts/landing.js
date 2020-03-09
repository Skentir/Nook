$(document).ready(function(){

    //form validation
    $("#sign-in-btn").click(function(){
        
        //boolean 
        var valid = true;

        valid = checkifValid($("#user-id"),valid);
        valid = checkifValid($("#user-pass"),valid);

        if(valid == true){
            location.href = "explore";
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
        valid = checkifValid($("#select-o"),valid);
        valid = checkifValid($("#select-p"),valid);

        if(valid == true){
            location.href = "explore";
        }
    })

    //function to check if fields are valid
    function checkifValid(field,val){
        var check = val;
        if(field.val() ==""){
            check = false;
            field.css({"border":"1px solid red"})
        }
        
        if($("#is-officer").is(":checked")) {
            if(field.val() == "0"){
                check = false;
                field.css({"border":"1px solid red"})
            }
        }

        return check;
    }


    //toggles checkboxes
    var officerStatus = function () {
        if ($("#is-officer").is(":checked")) {
            $('#select-org').show();
            $('#select-pos').show();
        }
        else {
            $('#select-org').hide();
            $('#select-pos').hide();
        }
      };
      $(officerStatus);
      $("#is-officer").change(officerStatus);

      var incentiveStatus = function () {
        if ($("#incentives").is(":checked")) {
            $('#incentivesdet').show()
        }
        else {
            $('#incentivesdet').hide();
        }
      };

      $(incentiveStatus);
      $("#incentives").change(incentiveStatus);
    

      $("#cso").click(function(){
        $("div[value = 'cso']").each(function(){
            $(this).show();
            $("div[value = 'non-cso']").each(function(){
                $(this).hide();
            })
            $("div[value = 'others']").each(function(){
                $(this).hide();
            })
        })
      })

      $("#non-cso").click(function(){
        $("div[value = 'non-cso']").each(function(){
            $(this).show();
            $("div[value = 'cso']").each(function(){
                $(this).hide();
            })
            $("div[value = 'others']").each(function(){
                $(this).hide();
            })
        })
      })

      $("#others").click(function(){
        $("div[value = 'others']").each(function(){
            $(this).show();
            $("div[value = 'non-cso']").each(function(){
                $(this).hide();
            })
            $("div[value = 'cso']").each(function(){
                $(this).hide();
            })
        })
      })
    

      
});