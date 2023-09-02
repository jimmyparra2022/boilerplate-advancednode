$(document).ready(function () {

  /*global io*/
  let socket = io();

  socket.on('user', function (data) {
    $('#num-users').text(data.currentUsers + ' users online');
    let message = 
      data.connected
        ? ' joined the chat'
        : ' left the chat'
    $('#messages').append('<li>').html( '<b>' + data.username + message + ( '</b>' ))
  })

  // Form submittion with new message in field with id 'm'
  $('form').submit(function () {
    var messageToSend = $('#m').val();

    $('#m').val('');
    return false; // prevent form submit from refreshing page
  });
});
