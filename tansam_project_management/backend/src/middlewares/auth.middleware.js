/**
 * Simple auth middleware (NO JWT)
 * Expects headers:
 *   x-user-id
 *   x-user-role
 */
export const authMiddleware = (req, res, next) => {
  const userId = req.headers["x-user-id"];
  const userRole = req.headers["x-user-role"];

  if (!userId || !userRole) {
    return res.status(401).json({
      message: "Unauthorized. Login required.",
    });
  }

  // Attach user info to request
  req.user = {
    id: userId,
    role: userRole,
  };

  next();
};
