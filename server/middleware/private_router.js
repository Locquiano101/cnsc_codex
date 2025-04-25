import jwt from "jsonwebtoken";

export const privateRouteMiddleware = (req, res, next) => {
  // Expect the token to be sent in the "Authorization" header as "Bearer <token>"
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  // Extract the token from the header
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    // Verify token. Replace 'your_jwt_secret' with your actual secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET  );
    req.user = decoded; // Attach the decoded user info to the request object
    next(); // Token is valid, proceed to the next middleware or route handler
  } catch (err) {
    return res.status(400).json({ error: "Invalid token." });
  }
};
