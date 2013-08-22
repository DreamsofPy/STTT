var express = require("express");
var http = require("http");
var _ = require("underscore");
var socketio = require("socket.io");
var shortId = require("shortid");
var app = express();
var port = 3700;

app.set('views', __dirname + '/templates');
app.set('view engine', "jade");
app.engine("jade", require("jade").__express);
app.use(express.static(__dirname + '/public'));

var httpServer = http.createServer(app).listen(port, function () {
  console.log("Listening on port" + port);
});

var io = socketio.listen(httpServer);

var game = {};
var turn = "x";

/* Socket Handlers */
io.sockets.on("connection", function (socket) {

  console.log("socket established connections");
  socket.emit("message", {message: "welcome to the game"});
  socket.on("makeMove", function (data) {
    console.log(data);
    var valid = validateMove(data, game, turn);
    if (valid) {
      turn = (turn === "x") ? "o" : "x";
      game[data.block] = data.player;
    }
    io.sockets.emit("moveResult", { valid: valid, player: data.player, block: data.block, win: false});
  });
});

/*  ROUTES */

app.get('/', function (req, res) {
  var gameId = shortId.generate();
  res.render("landing", {id: gameId});
});

app.get('/game/:gameid', function (req, res) {
  res.send("in game");
});

/* Game Logic */
function validateMove(data, game, turn) {
  if (data.player !== turn)
    return false;
  if(game.hasOwnProperty(data.block))
    return false;
  return true;
}