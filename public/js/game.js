window.onload = function () {

  var socket = io.connect("/");

  socket.on("message", function (data) {
    console.log(data.message);
  });

  var blockHash = {};
  for (var i = 1; i <= 9; i++)
    blockHash['B' + i] = i
  var tableHash = {};
  for (var i = 1; i <= 9; i++)
    tableHash['T' + i] = i

  $(".stBlock").click(function (evt){
    var blockId = evt.target.classList[0];
    var tableId = evt.target.parentNode.parentNode.parentNode.id;
    var gameId = $(".sttt")[0].id;
    var playerId = $("#playerMarker").find(":selected")[0].id
    socket.emit("makeMove", {
      block: blockHash[blockId],
      table : tableHash[tableId],
      player: playerId,
      gameId: gameId
    });
  });

  socket.on("moveResult", function (data) {
    var result = "Game Drawn!!";
    if(data.end) {
      if (!!data.winner) {
        result = "Player" + data.winner + " wins. Congratulations!!";
      }
      $(".game-result").html(result);
      $("#winModal").modal();
    }
    if(data.valid) {
      var img = document.createElement("img");
      var imgSrc = "/img/" + data.player + "-24.png";
      img.src = imgSrc;
      var turn = data.player === "x" ? "O" : "X";
      $("." + data.block)[data.table - 1].prepend(img);
      $(".turn").html(turn);
    }
  });
};