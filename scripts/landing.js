$(document).ready(function(){

    $(".google-button").click(function(e){
        window.location="/google"
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

      function validateFileType() {
        var fileName = document.getElementById("reg-photo").value;
        var idxDot = fileName.lastIndexOf(".") + 1;
        var extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
      
        if (!(extFile === "jpg" || extFile === "jpeg" || extFile === "png")) {
          alert("Only JPG/JPEG and PNG files are allowed for upload.");
          document.getElementById("reg-photo").value = "";
        }  
    }
    

      
});

$(document).on('change', '.custom-file-input', function (event) {
    $(this).next('.custom-file-label').html(event.target.files[0].name);
})