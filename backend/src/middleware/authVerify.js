const { admin } = require('../services/firebaseService');
const { Volunteer } = require('../models/model'); 

// Middleware to verify token
const verifyAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    const result = await verifyToken(token);
    if (!result.success) {
      return res.status(401).json(result);
    }
    req.volunteer = result.volunteer;

    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const verifyToken = async (token) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);

    // Find volunteer with matching firebase_uid
    const volunteer = await Volunteer.findOne({
      where: { firebase_uid: decodedToken.uid },
    });

    if (!volunteer) {
      throw new Error('Volunteer not found with this token');
    }

    return {
      success: true,
      volunteer,
      decodedToken,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Invalid token: ' + error.message,
    };
  }
};

module.exports = {
  verifyAuth,
};
