const User = require('../models/User');
const jwt = require('jsonwebtoken');

const authController = {
  register: async (req, res) => {
    try {
      const user = new User(req.body);
      await user.save();
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      
      // Create a user object without the password
      const userResponse = user.toObject();
      delete userResponse.password;
      
      res.status(201).json({ user: userResponse, token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      console.log('User:', user);
      
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      
      // Create a user object without the password
      const userResponse = user.toObject();
      delete userResponse.password;
      
      res.json({ user: userResponse, token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = authController;