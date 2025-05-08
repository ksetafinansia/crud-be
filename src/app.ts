import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import taskRoutes from './routes/taskRoutes';
import authMiddleware from './middleware/authMiddleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(authMiddleware); // Apply authentication middleware to all routes

// MongoDB connection
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error('MongoDB URI is not defined in the environment variables.');
  process.exit(1);
}

mongoose.connect(mongoURI).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

// Basic route
app.get('/', (req, res) => {
  res.send('Express app is running');
});

// Use taskRoutes under the /api path
app.use('/api', taskRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;