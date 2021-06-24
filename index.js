const { google } = require("googleapis");
const { WAIT_TIME } = require("./constants");
const getAccessToken = require("./getFirstAccess");
const listFolders = require("./getDriveFiles");

require("dotenv").config();

const startBot = () => {
  const credentials = {
    client_id: process.env.client_id,
    client_secret: process.env.client_secret,
    redirect_uris: process.env.redirect_uris,
  };

  authorize(credentials, listFolders);
};

function authorize(credentials, listFolders) {
  const { client_secret, client_id, redirect_uris } = credentials;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris
  );

  // when running for the first time, use this getAccessToken
  // getAccessToken(oAuth2Client, listFolders);

  const tokenCredentials = {
    access_token: process.env.access_token_drive,
    refresh_token: process.env.refresh_token,
    scope: process.env.scope,
    token_type: process.env.token_type,
    expiry_date: process.env.expiry_date,
  };

  oAuth2Client.setCredentials(tokenCredentials);

  listFolders(oAuth2Client);
}

startBot();
setInterval(startBot, WAIT_TIME);
