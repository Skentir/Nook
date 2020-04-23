$(document).ready(function(){
    // function checkTime(start,end,val){
    //     var valid = val;
    //     if(start.getTime() > end.getTime()){
    //         valid = false;
    //         start.css({"border":"1px solid red"});
    //     }
    //     return valid;
    // }

    $("#edit-event").click(function(){
        // var valid = true;

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
        // valid = checkTime(start, end, valid);
        // console.log(valid);

        console.log(updated_event);

        // $.ajax({
        //     url: '/admin/editevent',
        //     type: 'PUT',
        //     data: updated_event,
        //     dataType: 'JSON'
        // })
    })
})