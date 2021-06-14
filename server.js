const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);


app.use("/static", express.static('./static/'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('mouse position', (pos) => {
    io.emit('mouse position', pos);
    // console.log("great");
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});