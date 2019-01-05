$('#purchase').click(function () {
    var pass = $('#pass').val()
    if(!pass){
        alert('empty password!');
        return;
    }

    $.ajax({
        url: '/payment',
        type: 'post',
        dataType: 'text',
        data: {id: getid(), pass: pass},
    }).done(function () {
        alert('paid succeed!')
        window.location.replace("/home");
        console.log('good!');
    }).fail(function (jqXHR, textStatus, err) {
        console.log(jqXHR.responseText);
        alert(jqXHR.responseText)
    })


});

function getid() {
    var url_string = window.location.href; //window.location.href
    var url = new URL(url_string);
    var id = url.searchParams.get("id");
    return id;
    console.log(id);
}