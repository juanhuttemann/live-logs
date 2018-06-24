var readLastLines = require('read-last-lines');
var chokidar = require('chokidar');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


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
    chokidar.watch('sample-log-file.txt', { ignored: /(^|[\/\\])\../ }).on('change', (event, path) => {
        readLastLines.read('sample-log-file.txt', 1)
            .then(function (lines){
                socket.emit('log', lines);
            })
    });
});



