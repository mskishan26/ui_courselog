const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const config = require('../config/config');

async function initEmail() {
    try {
        const redirectUris = config.gmail_redirect_uris.split(',');

        const oAuth2Client = new google.auth.OAuth2(
            config.gmail_client_id,
            config.gmail_client_secret,
            redirectUris[0]
        );

        oAuth2Client.setCredentials({ refresh_token: config.gmail_refresh_token });

        // Use the async version of getAccessToken()
        const accessToken = await oAuth2Client.getAccessTokenAsync();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: config.gmail_email_from,
                clientId: config.gmail_client_id,
                clientSecret: config.gmail_client_secret,
                refreshToken: config.gmail_refresh_token,
                accessToken: accessToken
            }
        });

        console.log('Gmail Service Initialized');
        return transporter;
    } catch (error) {
        console.error('Gmail Connection Failed:', error);
        process.exit(1);
    }
}

module.exports = { initEmail };