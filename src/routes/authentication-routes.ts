import { Hono } from "hono";
import {
  logInWithUsernameAndPassword,
  signUpWithUsernameAndPassword,
} from "../controllers/authentication/authentications-controllers";
import {
  LogInWithUsernameAndPasswordError,
  SignUpWithUsernameAndPasswordError,
} from "../controllers/authentication/authentication-types";

// Create a new instance of Hono for defining authentication routes
export const authenticationRoutes = new Hono();

// Route to handle user sign-up
authenticationRoutes.post("/sign-in", async (c) => {
  const { username, password, name } = await c.req.json(); // Extract username, password, and name from the request body
  try {
    // Call the sign-up controller function to create a new user
    const result = await signUpWithUsernameAndPassword({
      username,
      password,
      name,
    });

    // Return the result with a 200 status code
    return c.json({ data: result }, 200);
  } catch (error) {
    // Handle specific errors during sign-up
    if (error === SignUpWithUsernameAndPasswordError.CONFLICTING_USERNAME) {
      return c.json({ error: "Username already exists" }, 409); // Conflict error
    }

    if (error === SignUpWithUsernameAndPasswordError.UNKNOWN) {
      return c.json({ error: "Unknown error" }, 500); // Internal server error
    }
  }
});

// Route to handle user log-in
authenticationRoutes.post("/log-in", async (c) => {
  try {
    const { username, password } = await c.req.json(); // Extract username and password from the request body

    // Call the log-in controller function to authenticate the user
    const result = await logInWithUsernameAndPassword({
      username,
      password,
    });

    // Return the result with a 200 status code
    return c.json(
      {
        data: result,
      },
      200
    );
  } catch (error) {
    // Handle specific errors during log-in
    if (
      error === LogInWithUsernameAndPasswordError.INCORRECT_USERNAME_OR_PASSWORD
    ) {
      return c.json({ error: "Incorrect username or password" }, 401); // Unauthorized error
    }

    // Handle unknown errors
    return c.json({ error: "Unknown error" }, 500); // Internal server error
  }
});