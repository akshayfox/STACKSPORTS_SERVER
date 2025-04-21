const express = require('express');
require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config/db');
const designRouter = require("./routes/designRouter");
const formRouter = require("./routes/formRoutes");
const uploadRoutes = require("./routes/uploadRouter");
const authRoutes = require("./routes/authRoutes");
const groupRoutes = require("./routes/groupRoutes"); 
const clientRoutes = require("./routes/clientRoutes"); 
const userRouter = require("./routes/userRouter"); 



const app = express();
const PORT = process.env.PORT || 3005;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Welcome to the Node.js Server with MongoDB!');
});

app.use("/api/designs", designRouter);
app.use("/api/user", userRouter);

app.use("/api/form", formRouter);
app.use("/api/image", uploadRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes); 
app.use("/api/groups", groupRoutes); // Add this line
app.use('/uploads', express.static('uploads'));

app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something broke!',
    details: err.message
  });
});

// Declare server variable at the top level
let server;

const startServer = async () => {
  try {
    await connectDB();
    
    server = app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode at http://localhost:${PORT}`);
    });

    // Error handling for EADDRINUSE
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Trying alternative port...`);
        const newPort = PORT + 1;
        server.listen(newPort);
      } else {
        console.error('Server error:', error);
        process.exit(1);
      }
    });

    // Graceful shutdown handlers
    process.on('SIGTERM', () => {
      console.log('SIGTERM received. Shutting down gracefully');
      server?.close(() => {
        console.log('Process terminated');
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT received. Shutting down gracefully');
      server?.close(() => {
        console.log('Process terminated');
      });
    });

  } catch (err) {
    console.error('Failed to connect to the database:', err.message);
    process.exit(1);
  }
};

startServer();