const { sequelize, ...models } = require('../models/model');
const config = require('../config/config');

async function initSequelize() {
  try {
    await sequelize.authenticate();
    console.log('Sequelize Connection');
  } catch (error) {
    console.error('Sequelize Connection Failed:', error);
    process.exit(1);
  }
}

module.exports = { sequelize, models, initSequelize };
