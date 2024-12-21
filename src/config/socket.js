const socketIo = require('socket.io');

const configureSocket = (server) => {
  const io = socketIo(server, {
    cors: { origin: '*' }, // Enable CORS
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    
    socket.on('disconnect', () => {
      console.log('A user disconnected:', socket.id);
    });
  });

  return io;
};

module.exports = configureSocket;
