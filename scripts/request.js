$(document).ready(function(){
    console.log("Inside file")
    $(".check").click(function(){
        var $addBtn = $(this);
        var id = $addBtn.data('id');

        console.log("Check me " + id);
        
        /*
        $.ajax({
            type: "DELETE",
            url: "/lineitem/". id,  // or whatever is the URL to the destroy action in the controller
            success: function (data) {
                $('.cart-data-details__total').remove(); // assumes that the wrapper for each line item is cart-data-details__total
            }               
        });
        */
       var string = '#' + id;
        $(string).remove(); 
       return false;
    });

    $(".reject").click(function(){
        var $deleteBtn = $(this);
        var id = $deleteBtn.data('id');

        console.log("Delete me " + id)
        
        var string = '#' + id;
        $(string).remove(); 
    });
})
