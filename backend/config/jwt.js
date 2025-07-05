require('dotenv').config();

module.exports = {
  secret: process.env.JWT_SECRET || 'your-default-secret-key-123'
};
