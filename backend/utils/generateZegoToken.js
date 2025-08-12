const crypto = require('crypto');

function generateKitToken(appID, serverSecret, roomID, userID, userName, expireInSeconds = 3600) {
  const payloadObject = {
    app_id: appID,
    user_id: userID,
    nonce: Math.floor(Math.random() * 100000),
    ctime: Math.floor(Date.now() / 1000),
    expire: expireInSeconds,
    room_id: roomID,
    privileges: {
      // grant access to join, publish, etc.
      "room_login": 1,
      "publish_stream": 1,
    },
  };

  const payloadString = JSON.stringify(payloadObject);
  const payloadBase64 = Buffer.from(payloadString).toString('base64');

  const hash = crypto.createHmac('sha256', serverSecret)
    .update(payloadBase64)
    .digest('hex');

  const token = `04${hash}${payloadBase64}`;
  return token;
}

module.exports = generateKitToken;
    