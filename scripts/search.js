$(document).ready(function(){

    $("#search-bar").submit(function(event) {

        event.preventDefault();

        var $form = $( this ), form_url = $form.attr( 'action' );
  
        var orgName = $('#search-textbox').val();
        orgName = orgName.replace(/\s/g, '+')

        $.ajax({
            type: "GET",
            url: form_url+'?org_name='+orgName+"&type=1",
        }).done(function (data) {
            window.location.replace(form_url+'?org_name='+orgName+"&type=1");
        })
        .fail(function()  {
            alert("Sorry. Server unavailable. ");
        }); 
      });


    var availableTags = [];
    $.ajax({
    type: "GET",
    url: "/get-org-list/",
    }).done(function (data) {
    for (var i=0; i < data.length; i++)
        availableTags.push(data[i].org_name)
    })
    .fail(function()  {
        alert("Sorry. Server unavailable. ");
    });

    $( "#org-name-field" ).autocomplete({
        source: availableTags
    });

    $("#search-textbox").autocomplete({
        source: availableTags
    })
})