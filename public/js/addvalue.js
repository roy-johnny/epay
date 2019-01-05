$('#addvalue-form').submit(function() {
    // DO STUFF...
    val = $('#card').val()
    console.log(val);
    if (val === 'Select Credit Card')
        return false; // return false to cancel form action
    return true;
});