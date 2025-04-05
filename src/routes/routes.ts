import { Hono } from "hono";
import { authenticationRoutes } from "./authentication-routes.js";
import { usersRoutes } from "./users-routes.js";
import { postsRoutes } from "./posts-routes.js";
import { likesRoutes } from "./likes-routes.js";
import { commentsRoutes } from "./comments-routes.js";

export const allRoutes = new Hono();

allRoutes.route("/auth", authenticationRoutes);
allRoutes.route("/users", usersRoutes);
allRoutes.route("/posts", postsRoutes);
allRoutes.route("/likes", likesRoutes);
allRoutes.route("/comments", commentsRoutes);
allRoutes.get("/", (context) => {
    return context.json({
        message: "Welcome to the  hackernews server",
    });
    }
);