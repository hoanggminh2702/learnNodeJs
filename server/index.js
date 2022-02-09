const express = require('express');
const app = express();

app.use(express.static('public'));
const server = require('http').Server(app);

const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
});

const port = 8080;

const listOnline = ['public'];

const userRoom = {};

server.listen(port);
console.log(`Server is running on port ${port}`);

io.on('connection', function (socket) {
  console.log(`${socket.id} has connected`);

  socket.on('Request-List-Online', (username) => {
    if (!listOnline.includes(username)) {
      listOnline.push(username);
    }

    console.log(listOnline);

    io.sockets.emit('Response-List-Online', listOnline);

    socket.on('disconnect', function () {
      console.log(`${username} has disconnected`);
      if (listOnline.includes(username)) {
        listOnline.splice(listOnline.indexOf(username), 1);
      }
      io.sockets.emit('Response-List-Online', listOnline);
    });

    socket.on('join-room', (data) => {
      socket.leave(data.curRoom);
      socket.join(`${data.joinRoom}`);
      console.log(`Join room ${`${data.joinRoom}`} successful`);
      if (data.joinRoom === 'public') {
        socket.on(`public-request-send-message`, (message) => {
          io.in(`public`).emit(`public-response-send-message`, {
            id: username,
            message: message,
          });
        });
      } else {
        socket.on(`private-request-send-message`, (message) => {
          io.in(`${data.joinRoom}`).emit(`private-response-send-message`, {
            id: username,
            message: message,
          });
        });
      }
    });
  });

  socket.on('Client-sent-data', function (data) {
    //sau khi lắng nghe dữ liệu, server phát lại dữ liệu này đến các client khác
    socket.emit('Server-sent-data', data);
  });
});
