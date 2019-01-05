(function () {
    auth = {
        create: function (id, pw, onSuccess, onFail) {
            if (id && pw)
                postAjax('/create', {id: id, pw: sha1(pw)}, onSuccess, onFail);
            else
                onFail({msg: 'Empty ID or password.'});
        },
        update: function (id, pw, newId, newPw, onSuccess, onFail) {
            if (id && pw && newId && newPw) {
                challengeSecret(id, pw, function (secret) {
                    postAjax('/update', {id: id, secret: secret, newId: newId, newPw: sha1(newPw)}, onSuccess, onFail);
                }, onFail);
            } else {
                onFail({msg: 'Empty (new) ID or (new) password.'});
            }
        },
        delete: function (id, pw, onSuccess, onFail) {
            if (id && pw) {
                challengeSecret(id, pw, function (secret) {
                    postAjax('/delete', {name: id, secret: secret}, onSuccess, onFail);
                }, onFail);
            } else {
                onFail({msg: 'Empty ID or password.'});
            }
        },
        login: function (id, pw, recaptcha, para, onSuccess, onFail) {
            if (id && pw) {
                console.log('login')
                challengeSecret(id, pw, recaptcha, para,function (secret) {
                    console.log('secret:' + secret)
                    console.log($('#recaptcha-token'));
                }, onFail);
            } else {
                onFail({msg: 'Empty ID or password.'});
            }
        },
        logout: function (id, token, onSuccess, onFail) {

            postAjax('/logout', {id: id, token: token}, onSuccess, onFail);
        }
    };

    function urlAjax(url, onSuccess, onFail) {
        $.ajax(url).done(processRes(onSuccess, onFail));
    }

    function postAjax(url, payload, onSuccess, onFail) {
        $.post(url, payload, processRes(onSuccess, onFail));
    }

    function challengeSecret(id, pw, recaptcha, para, onSuccess, onFail) {
        console.log('recaptcha: ',recaptcha)
        $.ajax({
            url: '/',
            type: 'post',
            dataType: 'json',
            data: {name: id},
            success: function (data, status, xhr) {
                if (status === 'success') {
                    if(data.err){
                        alert(data.err);
                        window.location.reload(false);
                    }
                    var secret = '',
                        aesKey = sha1(pw + data.salt);
                    console.log(aesKey);
                    try {
                        //console.log(data.challenge, aeskey);
                        secret = aesDecrypt(data.challenge, aesKey);
                        console.log(secret)
                    } catch (err) {
                        console.log(err);
                        console.log('failed');
                        return onFail({msg: 'Incorrect password.'});
                    }
                    console.log()
                    $.ajax({
                        url: '/login',
                        type: 'post',
                        dataType: 'json',
                        data: {name: id, secret: secret, "g-recaptcha-response": recaptcha},
                        success: function (data, status, xhr) {
                            console.log(para);
                            console.log();
                            if (para && para !== ''){
                                console.log('??????');
                                window.location.replace("/pay?" + para);
                                console.log('!!!!');
                                return;
                            }
                            console.log('%%%%');
                            window.location.replace("/home");
                        }
                    }).fail(function () {
                        alert('Incorrect password or user name!')
                        window.location.reload(false);
                    });
                }
            },
            error: function (e) {
            }

        });
    }

    function sha1(data) {
        return CryptoJS.SHA1(data).toString(CryptoJS.enc.Base64);
    }

    function aesDecrypt(input, key) {
        return CryptoJS.AES.decrypt(input, key).toString(CryptoJS.enc.Utf8);
    }

    function processRes(onSuccess, onFail) {
        console.log('process')
        return function (res) {
            console.log(res);
            if (res.result) {
                console.log(res);
                if (onSuccess)
                    onSuccess(res)
            } else {
                if (onFail)
                    onFail(res.payload);
            }
        };
    }
})();

var id = '';
var token = '';
$('#login-submit').click(function () {
    event.preventDefault();
    id = $('#name')[0].value;
    var pw = $('#pass')[0].value;
    var recaptcha = $('#g-recaptcha-response').val();
    var para = window.location.search.substring(1);
    console.log(para);


    console.log('RECAPTCHA: ',recaptcha);
    console.log('click')
    auth.login(id, pw, recaptcha, para, function (data) {
        //token = data.token;
        console.log('suc')
        console.log(data);

    }, function (data) {
        alert('wrong password')
        window.location.reload(false);
    });
})