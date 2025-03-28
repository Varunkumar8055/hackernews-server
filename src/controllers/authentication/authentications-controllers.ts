import { createHash } from "crypto";
import {
  LogInWithUsernameAndPasswordError,
  SignUpWithUsernameAndPasswordError,
  type LogInWithUsernameAndPasswordResult,
  type SignUpWithUsernameAndPasswordResult,
} from "./authentication-types";
import { prisma } from "../../extras/prisma";
import jwt from "jsonwebtoken";
import { jwtSceretKey } from "../../../environment";

// Utility function to hash a password using SHA-256
export const createPasswordHash = (parameters: {
  password: string;
}): string => {
  return createHash("sha256").update(parameters.password).digest("hex");
};

// Utility function to create a JWT token for a user
const createJWToken = (parameters: {
  id: string;
  username: string;
}): string => {
  const jwtPayload: jwt.JwtPayload = {
    iss: "https://purpleshorts.co.in", // Issuer of the token
    sub: parameters.id, // Subject (user ID)
    username: parameters.username, // Username of the user
  };

  // Sign the token with the secret key and set an expiration of 30 days
  const token = jwt.sign(jwtPayload, jwtSceretKey, {
    expiresIn: "30d",
  });

  return token;
};

// Function to handle user sign-up with username and password
export const signUpWithUsernameAndPassword = async (parameters: {
  username: string;
  password: string;
  name: string;
}): Promise<SignUpWithUsernameAndPasswordResult> => {
  try {
    // Check if a user with the given username already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        username: parameters.username,
      },
    });

    if (existingUser) {
      // Throw an error if the username is already taken
      throw SignUpWithUsernameAndPasswordError.CONFLICTING_USERNAME;
    }

    // Hash the user's password
    const hashedPassword = createPasswordHash({
      password: parameters.password,
    });

    // Create a new user in the database
    const user = await prisma.user.create({
      data: {
        username: parameters.username,
        password: hashedPassword,
        name: parameters.name,
      },
    });

    // Create a JWT payload for the new user
    const jwtPayload: jwt.JwtPayload = {
      iss: "http://purpleshorts.co.in", // Issuer of the token
      sub: user.id, // Subject (user ID)
      username: user.username, // Username of the user
    };

    // Sign the token with the secret key and set an expiration of 30 days
    const token = jwt.sign(jwtPayload, jwtSceretKey, {
      expiresIn: "30d",
    });

    // Return the token and user details
    const result: SignUpWithUsernameAndPasswordResult = {
      token,
      user,
    };

    return result;
  } catch (e) {
    console.error(e); // Log the error for debugging
    // Throw a generic error if something unexpected happens
    throw SignUpWithUsernameAndPasswordError.UNKNOWN;
  }
};

// Function to handle user log-in with username and password
export const logInWithUsernameAndPassword = async (parameters: {
  username: string;
  password: string;
}): Promise<LogInWithUsernameAndPasswordResult> => {
  // Hash the provided password
  const passwordHash = createPasswordHash({
    password: parameters.password,
  });

  // Find a user in the database with the given username and hashed password
  const user = await prisma.user.findUnique({
    where: {
      username: parameters.username,
      password: passwordHash,
    },
  });

  if (!user) {
    // Throw an error if the username or password is incorrect
    throw LogInWithUsernameAndPasswordError.INCORRECT_USERNAME_OR_PASSWORD;
  }

  // Create a JWT token for the authenticated user
  const token = createJWToken({
    id: user.id,
    username: user.username,
  });

  // Return the token and user details
  const result: LogInWithUsernameAndPasswordResult = {
    token,
    user,
  };

  return result;
};
