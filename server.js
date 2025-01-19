require('dotenv').config();
const http = require('http'); // To create an HTTP server
const configureApp = require('./src/config/app');
const connectDB = require('./src/config/database');
const configureSocket = require('./src/config/socket'); // Import the Socket.IO configuration

const startServer = async () => {
  // Connect to the database
  await connectDB();

  // Configure Express app
  const app = configureApp();

  // Create HTTP server for Socket.IO
  const server = http.createServer(app);

  // Configure and attach Socket.IO
  const io = configureSocket(server);

  // Attach `io` to the app for use in controllers
  app.set('socketio', io);

  // Start server
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer().catch(console.error);
