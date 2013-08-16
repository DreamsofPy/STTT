window.onload = function () {

  var socket = io.connect("/");

  socket.on("message", function (data) {
    console.log(data.message);
  });

  $(".stBlock").click(function (evt){
    console.log(evt.target.id);
  });
};