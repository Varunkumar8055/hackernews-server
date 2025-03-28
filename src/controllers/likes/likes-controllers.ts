import { getPagination } from "../../extras/pagination";
import { prisma } from "../../extras/prisma";
import { LikeStatus, type GetLikesResult, type LikeCreate } from "./like-types";

// Function to create a like on a post
export const createLike = async (params: {
  postId: string; // ID of the post to like
  userId: string; // ID of the user creating the like
}): Promise<LikeCreate> => {
  try {
    // Check if the post exists
    const post = await prisma.post.findUnique({
      where: { id: params.postId },
    });

    if (!post) {
      // Return status if the post is not found
      return { status: LikeStatus.POST_NOT_FOUND };
    }

    // Check if the user has already liked this post
    const existingLike = await prisma.like.findFirst({
      where: {
        postId: params.postId,
        userId: params.userId,
      },
    });

    if (existingLike) {
      // Return status if the user has already liked the post
      return { status: LikeStatus.ALREADY_LIKED };
    }

    // Create a new like in the database
    await prisma.like.create({
      data: {
        postId: params.postId,
        userId: params.userId,
      },
    });

    // Return success status
    return { status: LikeStatus.LIKE_SUCCESS };
  } catch (error) {
    console.error(error); // Log the error
    return { status: LikeStatus.UNKNOWN }; // Return unknown error status
  }
};

// Function to get all likes on a specific post (reverse chronological order, paginated)
export const getLikesOnPost = async (params: {
  postId: string; // ID of the post
  page: number;   // Current page number for pagination
  limit: number;  // Number of likes per page
}): Promise<GetLikesResult | LikeStatus> => {
  try {
    const { skip, take } = getPagination(params.page, params.limit);

    // Check if the post exists
    const post = await prisma.post.findUnique({
      where: { id: params.postId },
    });

    if (!post) {
      // Return status if the post is not found
      return LikeStatus.POST_NOT_FOUND;
    }

    // Fetch likes from the database
    const likes = await prisma.like.findMany({
      where: { postId: params.postId }, // Filter by postId
      orderBy: { createdAt: "desc" },  // Reverse chronological order
      skip,                            // Skip the specified number of records
      take,                            // Limit the number of records
      include: {
        user: {
          select: {
            id: true,        // Include user ID
            username: true,  // Include username
          },
        },
      },
    });

    if (!likes || likes.length === 0) {
      // Return status if no likes are found
      return LikeStatus.NO_LIKES_FOUND;
    }

    // Return the fetched likes
    return { likes };
  } catch (error) {
    console.error(error); // Log the error
    return LikeStatus.UNKNOWN; // Return unknown error status
  }
};

// Function to delete a like on a post
export const deleteLikeOnPost = async (params: {
  postId: string; // ID of the post
  userId: string; // ID of the user attempting to delete the like
}): Promise<LikeStatus> => {
  try {
    // Check if the like exists
    const like = await prisma.like.findFirst({
      where: {
        postId: params.postId,
        userId: params.userId,
      },
    });

    if (!like) {
      // Return status if the like is not found
      return LikeStatus.LIKE_NOT_FOUND;
    }

    // Delete the like from the database
    await prisma.like.delete({
      where: {
        id: like.id, // Use the like ID to delete
      },
    });

    // Return success status
    return LikeStatus.LIKE_DELETED;
  } catch (error) {
    console.error(error); // Log the error
    return LikeStatus.UNKNOWN; // Return unknown error status
  }
};