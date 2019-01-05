$('#signup-submit').click(function () {
    event.preventDefault();
    var name = $('#name')[0].value;
    var pass = $('#pass')[0].value;
    var fn = $('#fn')[0].value;
    var ln = $('#ln')[0].value;
    var address = $('#address')[0].value;
    var email = $('#email')[0].value;
    var phone = $('#phone')[0].value;
    if(is_empty(name) || is_empty(pass)){
        alert('empty username or password!');
        return;
    }

    //console.log('click');

    $.ajax({
        url: '/signup',
        type: 'post',
        dataType: 'json',
        data: {name: name, pass: pass, fn: fn, ln: ln, address:address, email:email, phone:phone},
    }).done(function () {
        alert('signup successfully');
        window.location.replace("/login");
        //console.log('good!');
    }).fail(function (jqXHR, textStatus, err) {
        alert('duplicate username');
    })

})

is_empty = function (val) {
    if(!val || val === undefined || val.length === 0){
        return true;
    }
    return false;
}