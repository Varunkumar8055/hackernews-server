import { Hono } from "hono";
import { tokenMiddleware } from "./middlewares/token-middlewares";
import { GetMe, GetUsers } from "../controllers/users/users-controllers";
import { GetAllUsersError, GetMeError } from "../controllers/users/users-type";

// Create a new instance of Hono for defining user routes
export const usersRoutes = new Hono();

// Route to get the current user's details
usersRoutes.get("/me", tokenMiddleware, async (context) => {
  try {
    const userId = context.get("userId"); // Extract userId from the token middleware
    const result = await GetMe({ userId }); // Call the GetMe controller function

    if (!result) {
      // Return an error if the user is not found
      return context.json({ error: "User not found" }, 404);
    }

    // Return the user's details with a 200 status code
    return context.json(result, 200);
  } catch (error) {
    // Handle specific errors during fetching the current user's details
    if (error === GetMeError.USER_NOT_FOUND) {
      return context.json({ error: "User not found" }, 404); // User not found error
    }
    if (error === GetMeError.UNKNOWN) {
      return context.json({ error: "Unknown error" }, 500); // Unknown error
    }
  }
});

// Route to get all users (paginated)
usersRoutes.get("/", tokenMiddleware, async (context) => {
  try {
    const page = parseInt(context.req.query("page") || "1", 10); // Extract page number from query parameters (default to 1)
    const limit = parseInt(context.req.query("limit") || "2", 10); // Extract limit from query parameters (default to 2)

    // Call the GetUsers controller function
    const result = await GetUsers({ page, limit });

    if (!result) {
      // Return an error if no users are found
      return context.json({ error: "Users not found" }, 404);
    }

    // Return the list of users with a 200 status code
    return context.json(result, 200);
  } catch (error) {
    // Handle specific errors during fetching all users
    if (error === GetAllUsersError.NO_USERS_FOUND) {
      return context.json({ error: "Users not found" }, 404); // No users found error
    }
    if (error === GetAllUsersError.UNKNOWN) {
      return context.json({ error: "Unknown error" }, 500); // Unknown error
    }
  }
});