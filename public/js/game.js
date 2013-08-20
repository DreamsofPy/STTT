window.onload = function () {

  var socket = io.connect("/");

  socket.on("message", function (data) {
    console.log(data.message);
  });

  $(".stBlock").click(function (evt){
    var blockId = evt.target.id;
    playerId = $("#playerMarker").find(":selected")[0].id;
    socket.emit("makeMove", { block: blockId, player: playerId });
  });

  socket.on("moveResult", function (data) {
    if(data.valid) {
      var img = document.createElement("img");
      var imgSrc = "/img/" + data.player + "-24.png";
      img.src = imgSrc;
      $("#" + data.block).prepend(img);
    }
  });
};