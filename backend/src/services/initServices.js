const { initSequelize } = require('./sequelizeService');
const { initFirebase } = require('./firebaseService');
const { initEmail } = require('./emailService');
const UserService = require('./userService');

async function initServices() {
  console.log('Initializing Services...');
  await initSequelize();
  initFirebase();
  // Initialize email service and get transporter
  const transporter = await initEmail();
  // Create AuthService instance with transporter
  const UserServices = new UserService(transporter);
  console.log('All Services Initialized');
  return {
    UserServices
  };

}

module.exports = { initServices };
