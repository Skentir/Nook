$(document).ready(function(){

    console.log("here!");
    $("#search-bar").submit(function(event) {

        event.preventDefault();

        var $form = $( this ), form_url = $form.attr( 'action' );
  
        var orgName = $('#search-textbox').val();
        orgName = orgName.replace(/\s/g, '+')
        console.log("the name is " + orgName);

        $.ajax({
            type: "GET",
            url: form_url+'?org_name='+orgName+"&type=1",
        }).done(function (data) {
            window.location.replace(form_url+'?org_name='+orgName+"&type=1");
            console.log("Hello!");
         });
      });
})