import type { User } from "@prisma/client";

// Type representing the result of fetching the current user's details
export type GetMeResult = {
  user: User; // The current user's details
};

// Enum representing possible errors when fetching the current user's details
export enum GetMeError {
  UNKNOWN = "UNKNOWN", // Represents an unknown error
  USER_NOT_FOUND = "USER_NOT_FOUND", // Indicates that the user was not found
}

// Type representing the result of fetching all users
export type GetAllUsersResult = {
  users: User[]; // An array of user objects
};

// Enum representing possible errors when fetching all users
export enum GetAllUsersError {
  NO_USERS_FOUND = "NO_USERS_FOUND", // Indicates that no users were found
  UNKNOWN = "UNKNOWN", // Represents an unknown error
}