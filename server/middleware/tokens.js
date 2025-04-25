import jwt from "jsonwebtoken";

const SECRET_KEY = "your_secret_key"; // Use a strong secret key

// Function to generate a JWT token
export function generateToken(userId, expiresIn = "1h") {
  return jwt.sign({ userId }, SECRET_KEY, { expiresIn });
}

// Function to verify a JWT token
export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null; // Token is invalid or expired
  }
}

// Generate a valid token
const token = generateToken("user123");

console.log("Generated Token:", token);
console.log("Verified Token:", verifyToken(token));
