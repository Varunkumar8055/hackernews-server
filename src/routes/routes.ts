import { Hono } from "hono";
import { authenticationRoutes } from "./authentication-routes"; // Import authentication-related routes
import { usersRoutes } from "./users-routs"; // Import user-related routes
import { postsRoutes } from "./post-routes"; // Import post-related routes
import { likeRoutes } from "./likes-routes"; // Import like-related routes
import { commentRoutes } from "./comments-routes"; // Import comment-related routes
import { logger } from "hono/logger"; // Import logger middleware for logging requests

// Create a new instance of Hono to define all routes
export const allRoutes = new Hono();

// Use the logger middleware to log all incoming requests
allRoutes.use(logger());

// Define the route for authentication-related endpoints
allRoutes.route("/auth", authenticationRoutes);

// Define the route for user-related endpoints
allRoutes.route("/users", usersRoutes);

// Define the route for post-related endpoints
allRoutes.route("/posts", postsRoutes);

// Define the route for like-related endpoints
allRoutes.route("/likes", likeRoutes);

// Define the route for comment-related endpoints
allRoutes.route("/comments", commentRoutes);
