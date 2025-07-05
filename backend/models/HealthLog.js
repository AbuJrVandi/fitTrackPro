const db = require('../config/database');

const HealthLog = {
  create: (log, callback) => {
    const { userId, logType, value, details } = log;
    const sql = 'INSERT INTO health_logs (user_id, log_type, value, details) VALUES (?, ?, ?, ?)';
    db.run(sql, [userId, logType, value, JSON.stringify(details)], function (err) {
      callback(err, { id: this.lastID });
    });
  },

  findByUser: (userId, callback) => {
    const sql = 'SELECT * FROM health_logs WHERE user_id = ? ORDER BY created_at DESC';
    db.all(sql, [userId], (err, rows) => {
      callback(err, rows);
    });
  }
};

module.exports = HealthLog;
