var express = require("express");
var http = require("http");
var _ = require("underscore");
var socketio = require("socket.io");

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
io.sockets.on("connection", function (socket) {
  console.log("socket established connections");
  socket.emit("message", {message: "welcome to the game"});
});
/*  ROUTES */

app.get('/', function (req, res) {
  res.render("game");
});