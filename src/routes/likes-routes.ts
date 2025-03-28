import {
  createLike,
  deleteLikeOnPost,
  getLikesOnPost,
} from "../controllers/likes/likes-controllers";
import { LikeStatus } from "../controllers/likes/likes-type";
import { tokenMiddleware } from "./middlewares/token-middleware";
import { Hono } from "hono";

// Create a new instance of Hono for defining like routes
export const likeRoutes = new Hono();

// Route to create a like on a post
likeRoutes.post("/on/:postId", tokenMiddleware, async (context) => {
  try {
    const userId = context.get("userId"); // Extract userId from the token middleware
    const postId = context.req.param("postId"); // Extract postId from the route parameter

    if (!userId) {
      // Return an error if the user is not authorized
      return context.json({ error: "Unauthorized" }, 401);
    }

    // Call the createLike controller function
    const result = await createLike({ postId, userId });

    if (result.status === LikeStatus.POST_NOT_FOUND) {
      // Return an error if the post is not found
      return context.json({ error: "Post not found" }, 404);
    }

    if (result.status === LikeStatus.ALREADY_LIKED) {
      // Return a message if the user has already liked the post
      return context.json({ message: "You have already liked this post" }, 200);
    }

    if (result.status === LikeStatus.UNKNOWN) {
      // Return an error for unknown issues
      return context.json({ error: "Unknown error" }, 500);
    }

    // Return a success message if the like was created successfully
    return context.json({ message: "Post liked successfully" }, 201);
  } catch (error) {
    console.error(error); // Log the error
    return context.json({ error: "Server error" }, 500); // Return a server error
  }
});

// Route to get all likes on a specific post
likeRoutes.get("/on/:postId", tokenMiddleware, async (context) => {
  try {
    const postId = context.req.param("postId"); // Extract postId from the route parameter
    const page = parseInt(context.req.query("page") || "1", 10); // Extract page number from query parameters (default to 1)
    const limit = parseInt(context.req.query("limit") || "2", 10); // Extract limit from query parameters (default to 2)

    // Call the getLikesOnPost controller function
    const result = await getLikesOnPost({
      postId: postId,
      page: page,
      limit: limit,
    });

    if (result === LikeStatus.POST_NOT_FOUND) {
      // Return an error if the post is not found
      return context.json({ error: "Post not found" }, 404);
    }

    if (result === LikeStatus.NO_LIKES_FOUND) {
      // Return an error if no likes are found on the post
      return context.json({ error: "No likes found on this post" }, 404);
    }

    if (result === LikeStatus.UNKNOWN) {
      // Return an error for unknown issues
      return context.json({ error: "An unknown error occurred" }, 500);
    }

    // Return the likes if found
    return context.json(result, 200);
  } catch (error) {
    console.error(error); // Log the error
    return context.json({ error: "Server error" }, 500); // Return a server error
  }
});

// Route to delete a like on a post
likeRoutes.delete("/on/:postId", tokenMiddleware, async (context) => {
  try {
    const postId = context.req.param("postId"); // Extract postId from the route parameter
    const userId = context.get("userId"); // Extract userId from the token middleware

    if (!postId || !userId) {
      // Return an error if postId or userId is invalid
      return context.json({ error: "Invalid postId or userId" }, 400);
    }

    // Call the deleteLikeOnPost controller function
    const result = await deleteLikeOnPost({ postId, userId });

    if (result === LikeStatus.LIKE_NOT_FOUND) {
      // Return an error if the like is not found or not authored by the user
      return context.json(
        { error: "Like not found or not authored by you" },
        404
      );
    }

    if (result === LikeStatus.UNKNOWN) {
      // Return an error for unknown issues
      return context.json({ error: "An unknown error occurred" }, 500);
    }

    // Return a success message if the like was deleted successfully
    return context.json({ message: "Like deleted successfully" }, 200);
  } catch (error) {
    console.error(error); // Log the error
    return context.json({ error: "Server error" }, 500); // Return a server error
  }
});
