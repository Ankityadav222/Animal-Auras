import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    // Extract token from either cookies or authorization header
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    // If no token is provided, return a 401 Unauthorized response
    if (!token) {
        return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    try {
        // Verify the token using the JWT secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the decoded user information (e.g., user ID, role) to req.user
        req.user = decoded;

        // Proceed to the next middleware or route handler
        next();
    } catch (err) {
        console.error('Token verification failed:', err);
        // Return a 403 Forbidden response if the token is invalid
        res.status(403).json({ message: 'Invalid token, authorization denied' });
    }
};


const authenticateUser = (req, res, next) => {
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
  
    if (!token) {
      return res.status(401).json({ message: 'No token provided, authorization denied' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Attach user info to req.user
      next();
    } catch (err) {
      console.error('Token verification failed:', err);
      res.status(403).json({ message: 'Invalid token, authorization denied' });
    }
  };
  
  export default authenticateUser;