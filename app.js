const chokidar = require('chokidar'),
  app = require('express')(),
  http = require('http').Server(app),
  io = require('socket.io')(http),
  fs = require('fs'),
  PORT = 3000,
  LOG_FILE = 'sample-log-file.txt'

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/style.css', function(req, res) {
  res.sendFile(__dirname + '/css/style.css');
});

app.get('/toggle.css', function(req, res) {
  res.sendFile(__dirname + '/css/toggle.css');
});

app.get('/typer.js', function(req, res) {
  res.sendFile(__dirname + '/js/typer.js');
});

http.listen(PORT, function() {
  console.log(`listening on PORT: ${PORT}`);
});

function fileReader(socket) {
  fs.readFile('sample-log-file.txt', (err, data) => {
    if (err) throw err;
    socket.emit('log', data.toString().split("\n").join('<br>'));
  });
}

io.on('connection', function(socket) {
  fileReader(socket)
  let watcher = chokidar.watch().on('change', () => {
    fileReader(socket)
  });

  socket.on('readLogs', function(data) {
    fileReader(socket)
    watcher = chokidar.watch('sample-log-file.txt').on('change', () => {
      fileReader(socket)
    });
    console.log("WATCHER STARTED");
  });

  socket.on('stopLogs', function(data) {
    watcher.close();
    console.log("WATCHER STOPED");
  });
});
