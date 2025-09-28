// Authorize HR role
const authorizeHR = (req, res, next) => {
    if (req.user && req.user.role === 'HR') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. HR role required.' });
    }
};


module.exports = authorizeHR;