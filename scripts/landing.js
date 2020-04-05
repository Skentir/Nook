$(document).ready(function(){

    /*form validation
    $("#sign-in-btn").click(function(){
        var email = $("email").val();
        var pass = $("password").val();
        $.ajax({
            url:"/login",
            type: "POST",
            contentType: "application/json",
            headers: {'Content-Type': 'application/json'},
            data:JSON.stringify({
               email:email,
               password:pass
            }),
            success: console.log("success"),
            error: function(xhr){
                console.log(xhr.statusText);
            }
        });
      */


    /*User Registration  thru ajax
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
                //get form 
                var myform = document.getElementById("reg_form");
                //create formdata object
                var formData = new FormData(myform);

                //ajax request to post the formdata to the url
                $.ajax({
                    url: '/', 
                    type: 'POST',
                    data:formData,
                    processData:false,
                    contentType: false,
                    error: function(jXhr, status){
                        console.log('error: '+status);  
                        console.log(formData);
                        
                    },
                    success: function(data){
                        console.log('upload successful: '+data);
                        for (var value of formData.values()) {
                            console.log(value); 
                         }
                         //window.location.assign('/explore');
                    }
                })
            
       


        
        }
    })*/


    /*Event Creation
    $("#submit-event").click(function(){
   

        var myform = document.getElementById("event_reg");
        console.log(myform);
        var formData = new FormData(myform);

        $(myForm + 'input[type=checkbox]:not(:checked)').each(function () {
            // set value 0 and check it
        $(myForm).attr('checked', true).val(0);
        })

        $.ajax({
            url: '/ad-eventreg', 
            type: 'POST',
            data:formData,
            processData:false,
            contentType: false,
            error: function(jXhr, status){
                console.log('error: '+status);  
                console.log(formData);
                
            },
            success: function(data){
                console.log('upload successful: '+data);
                for (var value of formData.values()) {
                    console.log(value); 
                 }
                 //window.location.assign('/explore');
            }
        })

    })
*/


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