$('#change-save').click(function () {
    console.log('click');
    event.preventDefault();
    var pass = $('#pass')[0].value;
    var newpass = $('#newpass')[0].value;
    var newpass1 = $('#newpass1')[0].value;

    if(is_empty(pass) || is_empty(newpass1) || is_empty(newpass)){
        alert('empty fields!');
        return;
    }
    if (newpass !== newpass1){
        alert('inconsistent password!')
        return;
    }

    $.ajax({
        url: '/changepassword',
        type: 'post',
        dataType: 'json',
        data: {pass: pass, newpass: newpass},
    }).done(function () {
        console.log('change password succeed!');
        window.location.replace("/home");
        console.log('good!');
    }).fail(function (jqXHR, textStatus, err) {
        alert(jqXHR.responseText);
        console.log(err);
        //alert('invalid password!');
    })

});

is_empty = function (val) {
    return !val || val.length === 0;
};