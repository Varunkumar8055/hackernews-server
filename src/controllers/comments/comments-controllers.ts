import { getPagination } from "../../extras/pagination";
import { prisma } from "../../extras/prisma";
import {
  CommentStatus,
  type CreatCommentResult,
  type CommentResult,
} from "./comments-type";

// Function to create a new comment for a post
export const createComment = async (params: {
  content: string; // Content of the comment
  postId: string; // ID of the post to which the comment belongs
  userId: string; // ID of the user creating the comment
}): Promise<CreatCommentResult> => {
  try {
    // Check if the post exists
    const existPostId = await prisma.post.findUnique({
      where: { id: params.postId },
    });

    if (!existPostId) {
      // Throw an error if the post does not exist
      throw new Error(CommentStatus.POST_NOT_FOUND);
    }

    // Create the comment in the database
    const result = await prisma.comment.create({
      data: {
        content: params.content,
        post: { connect: { id: params.postId } }, // Link the comment to the post
        user: { connect: { id: params.userId } }, // Link the comment to the user
      },
    });

    return { comment: result }; // Return the created comment
  } catch (error) {
    console.error("Error creating comment:", error); // Log the error
    throw new Error(CommentStatus.COMMENT_CREATION_FAILED); // Throw a creation failure error
  }
};

// Function to get all comments for a specific post (paginated and in reverse chronological order)
export const getAllComments = async (params: {
  postId: string; // ID of the post
  page: number; // Current page number for pagination
  limit: number; // Number of comments per page
}): Promise<{ comments: any[] }> => {
  try {
    // Calculate pagination parameters
    const { skip, take } = getPagination(params.page, params.limit);

    // Fetch comments from the database
    const comments = await prisma.comment.findMany({
      where: { postId: params.postId }, // Filter by postId
      orderBy: { createdAt: "desc" }, // Sort by creation date in descending order
      skip, // Skip the specified number of records
      take, // Limit the number of records
      include: {
        user: {
          select: {
            id: true, // Include user ID
            username: true, // Include username
          },
        },
      },
    });

    if (!comments || comments.length === 0) {
      // Return an empty array if no comments are found
      return { comments: [] };
    }

    return { comments }; // Return the fetched comments
  } catch (error) {
    console.error("Error fetching comments:", error); // Log the error
    throw new Error(CommentStatus.UNKNOWN); // Throw an unknown error
  }
};

// Function to delete a comment
export const deleteComment = async (params: {
  commentId: string; // ID of the comment to delete
  userId: string; // ID of the user attempting to delete the comment
}): Promise<CommentStatus> => {
  try {
    // Find the comment in the database
    const comment = await prisma.comment.findUnique({
      where: { id: params.commentId },
    });

    if (!comment) {
      // Return a not found status if the comment does not exist
      return CommentStatus.COMMENT_NOT_FOUND;
    }

    // Delete the comment from the database
    await prisma.comment.delete({ where: { id: params.commentId } });

    return CommentStatus.DELETE_SUCCESS; // Return a success status
  } catch (error) {
    console.error("Error deleting comment:", error); // Log the error
    return CommentStatus.UNKNOWN; // Return an unknown error status
  }
};

// Function to update a comment
export const updateComment = async (params: {
  commentId: string; // ID of the comment to update
  userId: string; // ID of the user attempting to update the comment
  content: string; // New content for the comment
}): Promise<CommentStatus> => {
  try {
    // Find the comment in the database
    const comment = await prisma.comment.findUnique({
      where: { id: params.commentId },
    });

    if (!comment) {
      // Return a not found status if the comment does not exist
      return CommentStatus.COMMENT_NOT_FOUND;
    }

    // Update the comment in the database
    await prisma.comment.update({
      where: { id: params.commentId },
      data: { content: params.content }, // Update the content of the comment
    });

    return CommentStatus.UPDATE_SUCCESS; // Return a success status
  } catch (error) {
    console.error("Error updating comment:", error); // Log the error
    return CommentStatus.UNKNOWN; // Return an unknown error status
  }
};
