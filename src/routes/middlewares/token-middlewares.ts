import { createMiddleware } from "hono/factory"; // Import the factory function to create middleware
import jwt from "jsonwebtoken"; // Import the JSON Web Token library for token verification
import { jwtSceretKey } from "../../../environment"; // Import the secret key for JWT verification from the environment

// Define a middleware to validate JWT tokens and extract the user ID
export const tokenMiddleware = createMiddleware<{
  Variables: {
    userId: string; // Define a variable to store the user ID extracted from the token
  };
}>(async (context, next) => {
  const token = context.req.header("token"); // Extract the token from the request headers

  if (!token) {
    // If no token is provided, return an unauthorized error
    return context.json({ error: "Unauthorized" }, 401);
  }

  try {
    // Verify the token using the secret key
    const payload = jwt.verify(token, jwtSceretKey) as jwt.JwtPayload;
    const userId = payload.sub; // Extract the user ID (subject) from the token payload

    if (userId) {
      // If a user ID is found, set it in the context variables
      context.set("userId", userId);
    }

    await next(); // Proceed to the next middleware or route handler
  } catch (error) {
    // If token verification fails, return an unauthorized error
    return context.json({ error: "Unauthorized" }, 401);
  }
});
