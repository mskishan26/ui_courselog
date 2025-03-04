require('dotenv').config();

module.exports = {
  //db secrets
  db_username: process.env.DB_USER,
  db_password: process.env.DB_PASSWORD,
  db_name: process.env.DB_NAME,
  db_host: process.env.DB_HOST,
  db_dialect: 'postgres',
  // logging: console.log, // Set to false to disable logging
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },

  //firebase - all in a single string
  FIREBASE_SERVICE_ACCOUNT: process.env.FIREBASE_SERVICE_ACCOUNT,

  //gmail secrets
  gmail_client_id: process.env.GMAIL_CLIENT_ID,
  gmail_project_id:process.env.GMAIL_PROJECT_ID,
  gmail_auth_uri:process.env.GMAIL_AUTH_URI,
  gmail_token_uri:process.env.GMAIL_TOKEN_URI,
  gmail_auth_provider:process.env.GMAIL_AUTH_PROVIDER_X509_CERT_URL,
  gmail_client_secret:process.env.GMAIL_CLIENT_SECRET,
  gmail_redirect_uris:process.env.GMAIL_REDIRECT_URIS,
  gmail_refresh_token:process.env.GMAIL_REFRESH_TOKEN,
  gmail_email_from:process.env.GMAIL_EMAIL_FROM,

  }