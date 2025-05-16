"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenMiddleware = void 0;
const factory_1 = require("hono/factory");
const jsonwebtoken_1 = require("jsonwebtoken");
const environment_js_1 = require("../../environment.js");
exports.tokenMiddleware = (0, factory_1.createMiddleware)(async (context, next) => {
    const token = context.req.header("token");
    if (!token) {
        return context.json({
            message: "missing Token",
        }, 401);
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, environment_js_1.jwtSecretKey);
        const userId = payload.sub;
        if (userId) {
            context.set("userId", userId);
        }
        await next();
    }
    catch (e) {
        return context.json({ message: "Unauthorized token" }, 401);
    }
}); // import { createMiddleware } from "hono/factory";
// import jwt from "jsonwebtoken";
// import { jwtSecretKey } from "../../environment.js";
// export const tokenMiddleware = createMiddleware<{
//   Variables: {
//     userId: string;
//   };
// }>(async (context, next) => {
//   const token = context.req.header("token");
//   if (!token) {
//     return context.json(
//       {
//         message: "missing Token",
//       },
//       401
//     );
//   }
//   try {
//     const payload = jwt.verify(token, jwtSecretKey) as jwt.JwtPayload;
//     const userId = payload.sub;
//     if (userId) {
//       context.set("userId", userId);
//     }
//     await next();
//   } catch (e) {
//     return context.json({ message: "Unauthorized token" }, 401);
//   }
// });
