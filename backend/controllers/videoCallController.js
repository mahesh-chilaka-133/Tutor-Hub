const generateZegoToken = require('../utils/generateZegoToken');

exports.generateVideoToken = (req, res) => {
  const { roomID } = req.body;
  const userID = req.user.id;
  const userName = req.user.name;

  if (!roomID || !userID || !userName) {
    return res.status(400).json({ error: 'Missing one of roomID, userID, userName' });
  }

  const appID = parseInt(process.env.ZEGO_APP_ID);
  const serverSecret = process.env.ZEGO_SERVER_SECRET;
  const kitToken = generateZegoToken(appID, serverSecret, roomID, userID, userName, 3600);

  res.status(200).json({ token: kitToken });
};
