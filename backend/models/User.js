const db = require('../config/database');

const User = {
  create: (userData, callback) => {
    const { email, password, fullName } = userData;
    console.log('Creating user:', { email, fullName });
    const sql = `
      INSERT INTO users (
        email,
        password,
        full_name,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, datetime('now'), datetime('now'))
    `;
    db.run(sql, [email, password, fullName], function(err) {
      if (err) {
        console.error('Error creating user:', err);
        return callback(err);
      }
      
      console.log('User created successfully with ID:', this.lastID);
      // Return the created user without password
      User.findById(this.lastID, (err, user) => {
        if (err) {
          console.error('Error finding created user:', err);
        } else {
          console.log('Found created user:', user);
        }
        callback(err, user);
      });
    });
  },

  findByEmail: (email, callback) => {
    console.log('Looking up user by email:', email);
    const sql = `
      SELECT id, email, password, full_name, created_at, updated_at
      FROM users 
      WHERE email = ?
    `;
    db.get(sql, [email], (err, row) => {
      if (err) {
        console.error('Error finding user by email:', err);
      } else {
        console.log('Found user by email:', row ? { ...row, password: '[REDACTED]' } : 'No user found');
      }
      callback(err, row);
    });
  },

  findById: (id, callback) => {
    console.log('Looking up user by ID:', id);
    const sql = `
      SELECT id, email, full_name, created_at, updated_at
      FROM users 
      WHERE id = ?
    `;
    db.get(sql, [id], (err, row) => {
      if (err) {
        console.error('Error finding user by ID:', err);
      } else {
        console.log('Found user by ID:', row || 'No user found');
      }
      callback(err, row);
    });
  },

  updateProfile: (userId, profileData, callback) => {
    const { fullName } = profileData;
    console.log('Updating user profile:', { userId, fullName });
    const sql = `
      UPDATE users 
      SET full_name = ?, updated_at = datetime('now')
      WHERE id = ?
    `;
    db.run(sql, [fullName, userId], (err) => {
      if (err) {
        console.error('Error updating user profile:', err);
        return callback(err);
      }
      
      User.findById(userId, (err, user) => {
        if (err) {
          console.error('Error finding updated user:', err);
        } else {
          console.log('Updated user profile:', user);
        }
        callback(err, user);
      });
    });
  },

  updatePassword: (userId, hashedPassword, callback) => {
    console.log('Updating user password:', { userId });
    const sql = `
      UPDATE users 
      SET password = ?, updated_at = datetime('now')
      WHERE id = ?
    `;
    db.run(sql, [hashedPassword, userId], (err) => {
      if (err) {
        console.error('Error updating password:', err);
      } else {
        console.log('Password updated successfully');
      }
      callback(err);
    });
  }
};

module.exports = User;
