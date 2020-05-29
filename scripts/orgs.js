$(document).ready(function(){

    function parseTime(s) {
        var part = s.match(/(\d+):(\d+)(?: )?(am|pm)?/i);
        var hh = parseInt(part[1], 10);
        var mm = parseInt(part[2], 10);
        var ap = part[3] ? part[3].toUpperCase() : null;
        if (ap === "AM") {
            if (hh == 12) {
                hh = 0;
            }
        }
        if (ap === "PM") {
            if (hh != 12) {
                hh += 12;
            }
        }
        return { hh: hh, mm: mm };
    }
    
    function checkTime(s, e) {
        var valid = true
        
        var start = parseTime(s)
        var end = parseTime(e)
        
        if(start.hh > end.hh) {
            valid = false
            return valid
        }
        if(start.hh == end.hh && start.mm > end.mm) {
            valid = false
            return valid
        }
        
        return valid
    }

    var id = $(this).data('id');
    $("#editorg").click(function(){
                //get form 
                var myform = document.getElementById("editorgprofile");
                //create formdata object
                var formData = new FormData(myform);

                //ajax request to post the formdata to the url
                $.ajax({
                    url: '/admin/editorg', 
                    type: 'POST',
                    data:formData,
                    processData:false,
                    contentType: false,
                    error: function(jXhr, status){
                        // console.log('error: '+status);  
                        // console.log(formData);
                    },
                    success: function(data){
                         window.location.assign('/ad-tools');
                    }
                });
    })

    $('#incentivesdet').hide()
    $('input[type="checkbox"]').click(function() {
        if($(this).prop("checked") == true) {
            $('#incentivesdet').show()

        }
        else {
            $('#incentivesdet').hide()
        }
    })
    $("#edit-event").click(function(){
        if(checkTime($('#start-time-field').val(), $('#end-time-field').val())) {
            var name = $('#event-name-field').val();
            var desc = $('#event-desc-field').val();
            var things = $('#event-items-field').val();
            var header = $('#event-photo-field').val();
            var venue = $('#event-venue-field').val();
            var date = $('#event-date-field').val();
            var start = $('#start-time-field').val();
            var end = $('#end-time-field').val();
            var incentives = $('#event-incentives-field').val();

            var updated_event = {
                event_name: name,
                header_photo: header,
                date: date,
                start_time: start,
                end_time: end,
                about_desc: desc,
                venue: venue,
                things: things,
                incentives: incentives
            }
        }
        else {
            res.redirect('/error')
        }
    })
})