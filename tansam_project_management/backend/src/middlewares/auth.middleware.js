export const authMiddleware = (req, res, next) => {
  const userId = req.headers["x-user-id"];
  const userRole = req.headers["x-user-role"];
  const userName = req.headers["x-user-name"];

  if (!userId || !userRole) {
    return res.status(401).json({
      message: "Unauthorized. Login required.",
    });
  }

  req.user = {
    id: userId,
    role: userRole,
    name: userName, 
  };

  next();
};
