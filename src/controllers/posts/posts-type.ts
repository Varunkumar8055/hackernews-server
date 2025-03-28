import type { Post } from "@prisma/client";

// Type representing the result of creating a post
export type PostCreateResult = {
  post: Post; // The created post object
};

// Enum representing various statuses related to post creation
export enum PostStatus {
  USER_NOT_FOUND = "USER_NOT_FOUND", // Indicates that the user creating the post was not found
  POST_CREATED = "POST_CREATED", // Indicates that the post was successfully created
  POST_CREATION_FAILED = "POST_CREATION_FAILED", // Indicates that the post creation failed
}

// Type representing the result of fetching multiple posts
export type GetPostsResult = {
  posts: Post[]; // An array of post objects
};

// Enum representing possible errors when fetching posts
export enum GetPostsError {
  NO_POSTS_FOUND = "NO_POSTS_FOUND", // Indicates that no posts were found
  UNKNOWN = "UNKNOWN", // Represents an unknown error
}

// Enum representing possible errors when deleting a post
export enum DeletePostError {
  UNAUTHORIZED = "UNAUTHORIZED", // Indicates that the user is not authorized to delete the post
  POST_NOT_FOUND = "POST_NOT_FOUND", // Indicates that the post to be deleted was not found
  DELETE_SUCCESS = "DELETE_SUCCESS", // Indicates that the post was successfully deleted
  DELETE_FAILED = "DELETE_FAILED", // Indicates that the post deletion failed
}
