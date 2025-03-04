const express = require('express');
const cors = require('cors');
const { initServices } = require('./services/initServices');
const { verifyAuth } = require('./middleware/authVerify');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize services before starting the server
(async () => {
  try {
    const services = await initServices();

    // Create routers with injected services
    const userRouter = require('./routes/userRoute')(services.UserServices);
    
    // Middleware
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    
    // Routes
    app.use('/api/user', verifyAuth, userRouter);
    
    // Error handler
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    });
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to initialize services:', error);
    process.exit(1);
  }
})();
