import type { Comment } from "@prisma/client";

// Enum representing various statuses related to comments
export enum CommentStatus {
  POST_NOT_FOUND = "POST_NOT_FOUND", // Indicates that the post for the comment was not found
  CREATED_SUCCEFULLY = "CREATE_SUCCESSFULLY", // Indicates that the comment was created successfully
  COMMENT_CREATION_FAILED = "COMMENT_CREATION_FAILED", // Indicates that the comment creation failed
  COMMENT_NOT_FOUND = "COMMENT_NOT_FOUND", // Indicates that the comment was not found
  UNKNOWN = "UNKNOWN", // Represents an unknown error
  DELETE_SUCCESS = "DELETE_SUCCESS", // Indicates that the comment was deleted successfully
  UPDATE_SUCCESS = "UPDATE_SUCCESS", // Indicates that the comment was updated successfully
}

// Type representing the result of a successful comment creation
export type CreatCommentResult = {
  comment: Comment; // The created comment object
};

// Type representing the result of fetching multiple comments
export type CommentResult = {
  comment: Comment[]; // An array of comment objects
};
