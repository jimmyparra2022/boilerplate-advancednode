$(document).ready(function () {

  /*global io*/
  let socket = io();

  socket.on('user', function (data) {
    $('#num-users').text(data.currentUsers + ' users online');
    let message = 
      data.username +
      (data.connected
        ? ' joined the chat'
        : ' left the chat')
    $('#messages').append($('<li>').html( '<b>' + message + '</b>' ))
  })

  socket.on('chat message', data => {
    $('#messages').append($('<li>').html('<b>' + data.username + '</b> ' + data.message))
  });

  // Form submittion with new message in field with id 'm'
  $('form').submit(function () {
    var messageToSend = $('#m').val();
    socket.emit('chat message', message);
    $('#m').val('');
    return false; // prevent form submit from refreshing page
  });
});
