const express = require('express');
const cors = require('cors');
const routes = require('../routes');
const errorHandler = require('../middleware/errorHandler');
const authController = require('../controllers/authController');

const configureApp = () => {
  const app = express();
  
  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Routes
  app.use('/api', routes);
  
  // Auth routes
  app.post('/api/auth/register', authController.register);
  app.post('/api/auth/login', authController.login);
  
  // Error handling
  app.use(errorHandler);
  
  return app;
};

module.exports = configureApp;