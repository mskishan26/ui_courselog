const jwt = require('jsonwebtoken');
const rolePermissions = require('../config/rolePermissions');
const routePermissions = require('../config/routePermissions');

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Access denied' });
  
    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      req.user = verified;
      next();
    } catch (error) {
      res.status(400).json({ error: 'Invalid token' });
    }
  };
  
const checkPermission = (req, res, next) => {
    const userRole = req.user.role;  
    const route = req.baseUrl + req.path;
    const method = req.method;

    const requiredPermissions = routePermissions[route]?.[method] || [];
    const userPermissions = rolePermissions[userRole] || [];

    const hasPermission = requiredPermissions.every(perm => userPermissions.includes(perm));

    if (hasPermission) {
        next();
    } else {
        res.status(403).json({ error: 'Permission denied' });
    }
};

module.exports = {  
                verifyToken,
                checkPermission,
                
            };