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

var gameMoves = [];

/* Socket Handlers */
io.sockets.on("connection", function (socket) {

  console.log("socket established connections");
  socket.emit("message", {message: "welcome to the game"});
  socket.on("makeMove", function (data) {
    console.log(data);
    var currentGame = game[data.gameId];
    var currentTurn = currentGame.turn;
    var valid = validateMove(data, currentGame, currentTurn);
    if (valid) {
      game[data.gameId].turn = (currentTurn === "x") ? "o" : "x";
      storeMove(data);
    }
    var end = didGameEnd(currentGame, currentTurn);
    io.sockets.emit("moveResult", { valid: valid, player: data.player, block: data.block, table: data.table, end: false, winner: null});
  });
});

/*  ROUTES */

app.get('/', function (req, res) {
  var gameId = shortId.generate();
  res.render("landing", {id: gameId});
});

app.get('/game/:gameType/:gameid', function (req, res) {
  var gameId = req.params.gameid;
  var gameType = req.params.gameType;
  var playerId = "o";
  if (!game[gameId]) {
    playerId = "x";
    game[gameId] = {};
    game[gameId].turn = "x";
    game[gameId].gameType = req.params.gameType;
    game[gameId].moves = [];
  }
  res.render("game", {player: playerId, gameId: gameId, gameType: gameType});
});

/* Game Logic */
function validateMove(data, game, turn) {
  if (data.player !== turn)
    return false;
  if(!!game[id].moves[table] && !!game[id].moves[table][block])
    return false;
  return true;
}


function storeMove (data) {
  var table = data.table;
  var block = data.block;
  var id = data.gameId;
  if (!game[id].moves[table]) game[id].moves[table] = [];
  game[id].moves[table][block] = data.player;
  return;
}

function didGameEnd (game, turn) {
  return false;
}