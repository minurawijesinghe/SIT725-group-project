const socketIo = require('socket.io');

const configureSocket = (server) => {
  const io = socketIo(server);

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Listen for custom events
    socket.on('updateExpense', (data) => {
      console.log('Expense updated:', data);
      socket.broadcast.emit('expenseUpdated', data);
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected:', socket.id);
    });
  });

  return io; // Return the instance for use in the app
};

module.exports = configureSocket;
