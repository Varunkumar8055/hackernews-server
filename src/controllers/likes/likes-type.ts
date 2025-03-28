// Enum representing various statuses related to likes
export enum LikeStatus {
    ALREADY_LIKED = "ALREADY_LIKED", // Indicates the user has already liked the post
    LIKE_SUCCESS = "LIKE_SUCCESS",   // Indicates the like was successfully created
    UNKNOWN = "UNKNOWN",             // Represents an unknown error
    POST_NOT_FOUND = "POST_NOT_FOUND", // Indicates the post to be liked was not found
    NO_LIKES_FOUND = "NO_LIKES_FOUND", // Indicates no likes were found for the post
    LIKE_NOT_FOUND = "LIKE_NOT_FOUND", // Indicates the like to be deleted was not found
    LIKE_DELETED = "LIKE_DELETED",     // Indicates the like was successfully deleted
  }
  
  // Type representing the result of creating a like
  export type LikeCreate = {
    status: LikeStatus; // Status of the like creation operation
  };
  
  // Type representing the result of fetching likes for a post
  export type GetLikesResult = {
    likes: {
      id: string;       // ID of the like
      createdAt: Date;  // Timestamp of when the like was created
      user: {
        id: string;     // ID of the user who liked the post
        username: string; // Username of the user who liked the post
      };
    }[]; // Array of likes
  };