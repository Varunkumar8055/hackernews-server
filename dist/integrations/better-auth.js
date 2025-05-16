"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const better_auth_1 = require("better-auth");
const prisma_1 = require("better-auth/adapters/prisma");
const environment_ts_1 = require("../environment.ts");
const plugins_1 = require("better-auth/plugins");
const index_ts_1 = require("./prisma/index.ts");
// serverUrl
// webClientUrl
const betterAuthServerClient = (0, better_auth_1.betterAuth)({
    baseURL: environment_ts_1.serverUrl,
    trustedOrigins: [environment_ts_1.webClientUrl],
    secret: environment_ts_1.betterAuthSecret,
    database: (0, prisma_1.prismaAdapter)(index_ts_1.prismaClient, {
        provider: "postgresql",
    }),
    user: {
        modelName: "User",
    },
    session: {
        modelName: "Session",
    },
    account: {
        modelName: "Account",
    },
    verification: {
        modelName: "Verification",
    },
    emailAndPassword: {
        enabled: true,
    },
    plugins: [(0, plugins_1.username)()],
    advanced: {
        defaultCookieAttributes: {
            sameSite: "none",
            secure: true,
            partitioned: true,
        },
    },
});
exports.default = betterAuthServerClient;
