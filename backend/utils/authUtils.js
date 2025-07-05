const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/jwt');

const SALT_ROUNDS = 10;

const hashPassword = async (password) => {
  try {
    console.log('🔒 Generating salt...');
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    console.log('✅ Salt generated successfully');
    
    console.log('🔒 Hashing password...');
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('✅ Password hashed successfully');
    
    return hashedPassword;
  } catch (error) {
    console.error('❌ Error in hashPassword:', error);
    throw error;
  }
};

const comparePassword = async (password, hashedPassword) => {
  try {
    if (!password || !hashedPassword) {
      console.error('❌ Missing password or hashedPassword in comparison');
      return false;
    }
    
    console.log('🔍 Comparing password with hash...');
    const isMatch = await bcrypt.compare(password, hashedPassword);
    console.log('✅ Password comparison completed:', isMatch);
    
    return isMatch;
  } catch (error) {
    console.error('❌ Error in comparePassword:', error);
    throw error;
  }
};

const generateToken = (user) => {
  try {
    if (!user || !user.id) {
      console.error('❌ Invalid user object for token generation');
      throw new Error('Invalid user data for token generation');
    }

    console.log('🔑 Generating token for user:', user.id);
    const payload = {
      id: user.id,
      email: user.email
    };

    const token = jwt.sign(payload, config.secret, { expiresIn: '1d' });
    console.log('✅ Token generated successfully');
    
    return token;
  } catch (error) {
    console.error('❌ Error in generateToken:', error);
    throw error;
  }
};

module.exports = {
  hashPassword,
  comparePassword,
  generateToken
};
