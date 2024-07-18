require('dotenv').config();

const express = require('express');
const { Sequelize } = require('sequelize');
const config = require('./config/config.js');
const initializeModels = require('./models/model');
const authRoutes = require('./routes/userAuth');

const sequelize = new Sequelize(config.database, config.username, config.password, config);

// Initialize models
const models = initializeModels(sequelize);
const Volunteer = models.Volunteer;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello, World!');
  });

  app.use('/api/userAuth', (req, res, next) => {
    console.log(`Received ${req.method} request to ${req.url}`);
    next();
  }, authRoutes(Volunteer));

sequelize.authenticate().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});