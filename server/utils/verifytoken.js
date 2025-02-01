// utils/verifyToken.js
import jwt from "jsonwebtoken";
import { createError } from "./error.js";

// Verify token middleware
export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return next(createError(401, "You are not authenticated!"));
  }

  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) return next(createError(403, "Token is not valid!"));
    req.user = user;
    next();
  });
};

// Verify user or admin middleware
export const verifyUser = (req, res, next) => {
  verifyToken(req, res,next, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not authorized to access this resource!"));
    }
  });
};

// Verify admin middleware
export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, next, () => {
    // Highlighted: Ensuring the user has isAdmin property set to true
    if (req.user.id && req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not authorized to access this resource!"));
    }
  });
};
