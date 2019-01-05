$('#send-confirm').click(function () {
    event.preventDefault();
    var name = $('#name')[0].value;
    var pass = $('#pass')[0].value;
    var amount = $('#amount')[0].value;

    if(is_empty(name) || is_empty(pass)){
        alert('empty username or password!');
        return;
    }

    console.log('click');

    $.ajax({
        url: '/send',
        type: 'post',
        dataType: 'json',
        data: {name: name, pass: pass, amount: amount},
    }).done(function () {
        alert('send succeed!')
        window.location.replace("/home");
        console.log('good!');
    }).fail(function (jqXHR, textStatus, err) {
        console.log('failed');
        if(!err){
            alert('invalid username, password or invalid amount!')
        } else {
            alert(jqXHR.responseText);
        }
    })

})

is_empty = function (val) {
    return !val || val.length === 0;
};