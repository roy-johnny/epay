$('#request-confirm').click(function () {
    console.log('click');
    event.preventDefault();
    var name = $('#name')[0].value;
    var amount = $('#amount')[0].value;

    if(is_empty(name) || is_empty(amount)){
        alert('empty username or amount!');
        return;

    }

    $.ajax({
        url: '/request',
        type: 'post',
        dataType: 'json',
        data: {user: name, amount:amount},
    }).done(function () {
        console.log('request succeed!');
        window.location.replace("/home");
        console.log('good!');
    }).fail(function (jqXHR, textStatus, err) {
        console.log(jqXHR.responseText);
        console.log(err);
        alert('invalid username');
    })

});

is_empty = function (val) {
    return !val || val.length === 0;
};