$(function(){

    var userId = $('#userId').val();
    var tokenValue = $('#tokenValue').val();

    // Setup socket client
    var port = 1307;
    var host = window.location.host.split(':')[0];
    var socket = io.connect('http://' + host + ':' + port, {
        query: 'token=' + tokenValue + '&user_id=' + userId,
        transports: ['websocket']
    });

    var sendMessage = function(socket, userId) {
        $('#inputMesage').on('keypress', function(e) {
            var msg = $(this).val();
            var code = (e.keyCode ? e.keyCode : e.which);
            if (code == 13) {
                e.preventDefault();
                // Clear msg box
                $(this).val('');
                socket.emit('send', {
                    userId: userId,
                    message: msg
                })
            }
        });
    }

    var receiveMessage = function(data) {
        var html = '<li><b>' + data.userId + '</b>: ' + data.message + '</li>';
        $('#message').append(html).children(':last').animate({
            opacity: 1
        }, 1);
        $('#message').animate({scrollTop: $('#message').prop('scrollHeight')}, 50);
    }

    var poke = function(socket, userId) {
        $('#notice').on('click', '.poke', function (){
            var userPoked = $(this).data('user_id');
            socket.emit('poke', {
                userPoke: userId,
                userPoked: userPoked
            })
        });
    }

    var notification = function(data) {
        var html = '<li><b>' + data.userPoke + '</b> Poke You !</li>';
        $('#notification').append(html).children(':last').animate({
            opacity: 1
        }, 1);
        $('#notification').animate({scrollTop: $('#notification').prop('scrollHeight')}, 50);
    }

    var notice = function(data) {
        for (var i = 0; i < data.userIds.length; i++) {
            var dom = $('#' + data.userIds[i]);
            var msg = (data.userIds[i] == data.userId) ? data.msg : 'online !';
            var html = '<li id="' + data.userIds[i] + '">'
                            + data.userIds[i] + ' ' + msg;
            var poke = '';
            if (data.userIds[i] !== userId) {
                poke = ' <button class="poke" data-user_id="' + data.userIds[i] + '">Poke</button>';
            }
            console.log(data.userIds[i]);
            html += poke + '</li>';
            if (dom.length) {
                dom.html(data.userIds[i] + ' ' + msg + poke);
                continue;
            }
            $('#notice').append(html).children(':last').animate({
                opacity: 1
            }, 1);
        }
    }

    var removeNotice = function(data) {
        var dom = $('#' + data.userId)
        if (dom.length) {
            dom.html(data.userId + ' ' + data.msg);
        }
    }

    socket.on('connect', function() {
        console.log('Connected !');
        socket
            .emit('verify', {
                userId: userId,
                userToken: tokenValue
            })
            .on('ready', function(data) {
                console.log(data.msg);
            })
            .on('notice', function(data) {
                notice(data);
            })
            .on('remove-notice', function(data) {
                removeNotice(data);
            })
            .on('receive', function(data) {
                receiveMessage(data);
            })
            .on('notification', function(data) {
                notification(data);
            });
        sendMessage(socket, userId);
        poke(socket, userId);
    }).on('disconnect', function() {
        console.log('Disconnected !');
    });

});