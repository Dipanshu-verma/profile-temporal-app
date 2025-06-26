const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const userRoutes = require('./routes/userRoute');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/users', userRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Profile Temporal App Backend is running!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});