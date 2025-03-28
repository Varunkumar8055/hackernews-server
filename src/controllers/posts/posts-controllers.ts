import { getPagination } from "../../extras/pagination";
import { prisma } from "../../extras/prisma";
import {
  DeletePostError,
  GetPostsError,
  PostStatus,
  type GetPostsResult,
  type PostCreateResult,
} from "./posts-type";

// Function to create a new post
export const createPost = async (parameters: {
  title: string; // Title of the post
  content: string; // Content of the post
  authorId: string | undefined; // User ID of the author (from token or session)
}): Promise<PostCreateResult | PostStatus> => {
  try {
    if (!parameters.authorId) {
      // Return status if the user ID is not provided
      return PostStatus.USER_NOT_FOUND;
    }

    // Create a new post in the database
    const post = await prisma.post.create({
      data: {
        title: parameters.title,
        content: parameters.content,
        author: {
          connect: { id: parameters.authorId }, // Link the post to the author
        },
      },
    });

    return { post }; // Return the created post
  } catch (error) {
    console.error(error); // Log the error
    return PostStatus.POST_CREATION_FAILED; // Return status if post creation fails
  }
};

// Function to get all posts (paginated and in reverse chronological order)
export const getAllPosts = async (parameters: {
  page: number; // Current page number for pagination
  limit: number; // Number of posts per page
}): Promise<GetPostsResult> => {
  try {
    const { skip, take } = getPagination(parameters.page, parameters.limit);

    // Fetch posts from the database
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" }, // Sort by creation date in descending order
      skip, // Skip the specified number of records
      take, // Limit the number of records
      include: {
        author: {
          select: {
            id: true, // Include author ID
            username: true, // Include author username
          },
        },
      },
    });

    if (!posts || posts.length === 0) {
      // Throw an error if no posts are found
      throw new Error(GetPostsError.NO_POSTS_FOUND);
    }

    return { posts }; // Return the fetched posts
  } catch (error) {
    console.error(error); // Log the error
    throw new Error(GetPostsError.UNKNOWN); // Throw an unknown error
  }
};

// Function to retrieve all posts of a specific user (paginated and in reverse chronological order)
export const getPostsByUser = async (parameters: {
  userId: string; // ID of the user whose posts are to be retrieved
  page: number; // Current page number for pagination
  limit: number; // Number of posts per page
}): Promise<GetPostsResult> => {
  try {
    const { skip, take } = getPagination(parameters.page, parameters.limit);

    // Fetch posts of the specific user from the database
    const posts = await prisma.post.findMany({
      where: {
        userId: parameters.userId, // Filter by user ID
      },
      orderBy: { createdAt: "desc" }, // Sort by creation date in descending order
      skip, // Skip the specified number of records
      take, // Limit the number of records
      include: {
        author: {
          select: {
            id: true, // Include author ID
            username: true, // Include author username
          },
        },
      },
    });

    if (!posts || posts.length === 0) {
      // Throw an error if no posts are found
      throw new Error(GetPostsError.NO_POSTS_FOUND);
    }

    return { posts }; // Return the fetched posts
  } catch (error) {
    console.error(error); // Log the error
    throw new Error(GetPostsError.UNKNOWN); // Throw an unknown error
  }
};

// Function to delete a post
export const deletePost = async (params: {
  postId: string; // ID of the post to delete
  userId: string; // ID of the user attempting to delete the post
}): Promise<DeletePostError> => {
  try {
    // Check if the post exists and belongs to the user
    const post = await prisma.post.findUnique({
      where: { id: params.postId },
    });

    if (!post) {
      // Return status if the post is not found
      return DeletePostError.POST_NOT_FOUND;
    }

    if (post.userId !== params.userId) {
      // Return status if the user is not authorized to delete the post
      return DeletePostError.UNAUTHORIZED;
    }

    // Delete the post from the database
    await prisma.post.delete({
      where: { id: params.postId },
    });

    return DeletePostError.DELETE_SUCCESS; // Return success status
  } catch (error) {
    console.error(error); // Log the error
    return DeletePostError.DELETE_FAILED; // Return failure status
  }
};
