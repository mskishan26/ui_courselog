const admin = require('firebase-admin');
const config = require('../config/config');

const serviceAccount = JSON.parse(config.FIREBASE_SERVICE_ACCOUNT);

async function initFirebase() {
  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log('Firebase Initialized');
    }
  } catch (error) {
    console.error('Firebase Connection Failed:', error);
    process.exit(1);
  }
}

module.exports = { admin, initFirebase };
