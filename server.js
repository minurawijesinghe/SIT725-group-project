require('dotenv').config();
const configureApp = require('./src/config/app');
const connectDB = require('./src/config/database');

const startServer = async () => {
  // Connect to database
  await connectDB();

  // Configure Express app
  const app = configureApp();

  // Start server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer().catch(console.error);