var chokidar = require('chokidar');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const fs = require('fs');


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/style.css', function (req, res) {
    res.sendFile(__dirname + '/css/style.css');
});

app.get('/typer.js', function (req, res) {
    res.sendFile(__dirname + '/js/typer.js');
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});

io.on('connection', function (socket) {
  fs.readFile('sample-log-file.txt', (err, data) => {
    if (err) throw err;
      socket.emit('log', data.toString().split("\n").join('<br>'));
  });
    chokidar.watch('sample-log-file.txt', { ignored: /(^|[\/\\])\../ }).on('change', (event, path) => {
        fs.readFile('sample-log-file.txt', (err, data) => {
          if (err) throw err;
            socket.emit('log', data.toString().split("\n").join('<br>'));
        });

    });
});
