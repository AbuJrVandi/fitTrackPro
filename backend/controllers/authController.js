const User = require('../models/User');
const { hashPassword, comparePassword, generateToken } = require('../utils/authUtils');

const registerUser = async (req, res) => {
  try {
    console.log('📝 Registration request received:', { 
      email: req.body.email,
      fullName: req.body.fullName,
      passwordLength: req.body.password?.length
    });

    const { email, password, fullName } = req.body;

    // Validate input
    if (!email || !password || !fullName) {
      console.log('❌ Missing required fields:', { 
        email: !!email, 
        password: !!password, 
        fullName: !!fullName 
      });
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (password.length < 6) {
      console.log('❌ Password too short');
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check if user exists
    User.findByEmail(email, async (err, existingUser) => {
      if (err) {
        console.error('❌ Database error during user lookup:', err);
        return res.status(500).json({ message: 'Server error during user lookup', details: err.message });
      }
      
      if (existingUser) {
        console.log('❌ User already exists:', email);
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      try {
        // Hash password
        console.log('🔒 Hashing password...');
        const hashedPassword = await hashPassword(password);
        console.log('✅ Password hashed successfully');

        // Create user
        console.log('👤 Creating user in database...');
        User.create({ email, password: hashedPassword, fullName }, (err, newUser) => {
          if (err) {
            console.error('❌ Database error during user creation:', err);
            return res.status(500).json({ message: 'Server error during user creation', details: err.message });
          }

          console.log('✅ User created successfully:', { 
            id: newUser.id, 
            email: newUser.email,
            fullName: newUser.full_name 
          });

          // Generate token
          const token = generateToken(newUser);
          console.log('🔑 Generated JWT token');

          // Return user data and token
          res.status(201).json({
            user: {
              id: newUser.id,
              email: newUser.email,
              fullName: newUser.full_name
            },
            token
          });
        });
      } catch (error) {
        console.error('❌ Password hashing error:', error);
        res.status(500).json({ message: 'Server error during password processing', details: error.message });
      }
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ message: 'Server error during registration', details: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    console.log('🔐 Login attempt:', { 
      email: req.body.email,
      passwordProvided: !!req.body.password
    });

    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      console.log('❌ Missing login credentials');
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find user
    User.findByEmail(email, async (err, user) => {
      if (err) {
        console.error('❌ Database error during login:', err);
        return res.status(500).json({ message: 'Server error during login' });
      }

      if (!user) {
        console.log('❌ User not found:', email);
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      console.log('✅ User found:', { 
        id: user.id, 
        email: user.email,
        hasPassword: !!user.password
      });

      try {
        // Verify password
        console.log('🔍 Comparing passwords...');
        const isMatch = await comparePassword(password, user.password);
        console.log('Password comparison result:', isMatch);

        if (!isMatch) {
          console.log('❌ Password mismatch for user:', email);
          return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(user);
        console.log('🔑 Generated JWT token for user:', email);

        // Return user data and token
        res.json({
          user: {
            id: user.id,
            email: user.email,
            fullName: user.full_name
          },
          token
        });
      } catch (error) {
        console.error('❌ Password comparison error:', error);
        res.status(500).json({ message: 'Server error during password verification' });
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide current and new password' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    // Find user
    User.findById(userId, async (err, user) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Server error during password change' });
      }

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      try {
        // Verify current password
        const isMatch = await comparePassword(currentPassword, user.password);

        if (!isMatch) {
          return res.status(401).json({ message: 'Current password is incorrect' });
        }

        // Hash new password
        const hashedPassword = await hashPassword(newPassword);

        // Update password
        User.updatePassword(userId, hashedPassword, (err) => {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Server error during password update' });
          }

          res.json({ message: 'Password updated successfully' });
        });
      } catch (error) {
        console.error('Password processing error:', error);
        res.status(500).json({ message: 'Server error during password change' });
      }
    });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ message: 'Server error during password change' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  changePassword
};
