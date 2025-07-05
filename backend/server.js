require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const healthLogRoutes = require('./routes/healthLogRoutes');
const db = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5002;
const HOST = '0.0.0.0'; // Listen on all network interfaces

// Middleware
app.use(cors({
  origin: true, // Allow all origins
  credentials: true
}));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error details:', err);
  console.error('Stack trace:', err.stack);
  res.status(500).json({ message: err.message || 'Internal server error' });
});

// Test database connection
db.get("SELECT 1", [], (err) => {
  if (err) {
    console.error('Database connection test failed:', err);
  } else {
    console.log('Database connection test successful');
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/logs', healthLogRoutes);

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
  console.log('CORS is enabled for all origins');
});
