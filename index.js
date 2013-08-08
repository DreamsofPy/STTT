var express = require("express");
var http = require("http");
var _ = require("underscore");
var app = express();
var port = 3700;

app.engine("jade", require("jade").__express);
var httpServer = http.createServer(app).listen(port, function () {
  console.log("Listening on port" + port);
});

/*  ROUTES */

app.get('/', function (req, res) {
  res.send("Super Tic Tac Toe");
});