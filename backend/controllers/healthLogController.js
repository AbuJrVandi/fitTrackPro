const HealthLog = require('../models/HealthLog');

const addHealthLog = (req, res) => {
  const { log_type, value, details } = req.body;
  const user_id = req.user.id;

  if (!log_type || value === undefined) {
    return res.status(400).json({ message: 'Log type and value are required' });
  }

  const newLog = {
    userId: user_id,
    logType: log_type,
    value: value,
    details: details || {}
  };

  HealthLog.create(newLog, (err, log) => {
    if (err) {
      return res.status(500).json({ message: 'Server error while saving log' });
    }
    res.status(201).json(log);
  });
};

const getHealthLogs = (req, res) => {
  const user_id = req.user.id;

  HealthLog.findByUser(user_id, (err, logs) => {
    if (err) {
      return res.status(500).json({ message: 'Server error while fetching logs' });
    }
    res.json(logs);
  });
};

module.exports = {
  addHealthLog,
  getHealthLogs
};
