import type { User } from "@prisma/client";

// Represents the result of a successful sign-up operation.
// Includes a JWT token and the user details.
export type SignUpWithUsernameAndPasswordResult = {
  token: string; // The JWT token issued after sign-up.
  user: User;    // The user object containing the newly created user's details.
};

// Defines possible errors that can occur during the sign-up process.
export enum SignUpWithUsernameAndPasswordError {
  CONFLICTING_USERNAME = "CONFLICTING_USERNAME", // Indicates the username is already taken.
  UNKNOWN = "UNKNOWN",                          // A fallback for any unexpected errors.
}

// Represents the result of a successful log-in operation.
// Includes a JWT token and the user details.
export type LogInWithUsernameAndPasswordResult = {
  token: string; // The JWT token issued after log-in.
  user: User;    // The user object containing the logged-in user's details.
};

// Defines possible errors that can occur during the log-in process.
export enum LogInWithUsernameAndPasswordError {
  INCORRECT_USERNAME_OR_PASSWORD = "INCORRECT_USERNAME_OR_PASSWORD", // Indicates invalid credentials.
  UNKNOWN = "UNKNOWN",                                               // A fallback for any unexpected errors.
}