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
    var currentGame = game[data.gameId];
    console.log(currentGame);
    var currentTurn = currentGame.turn;
    var valid = validateMove(data, currentGame, currentTurn);
    if (valid) {
      game[data.gameId].turn = (currentTurn === "x") ? "o" : "x";
      game[data.gameId][data.block] = data.player;
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
  var gameId = req.params.gameid;
  var playerId = "o";
  if (!game[gameId]) {
    playerId = "x";
    game[gameId] = {};
    game[gameId]["turn"] = "x";
  }
  res.render("game", {player: playerId, gameId: gameId});
});

/* Game Logic */
function validateMove(data, game, turn) {
  if (data.player !== turn)
    return false;
  if(game.hasOwnProperty(data.block))
    return false;
  return true;
}