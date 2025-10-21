// Middleware untuk cek role user
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role ${req.user.role} tidak memiliki akses ke resource ini`,
      });
    }
    next();
  };
};

module.exports = { authorize };
