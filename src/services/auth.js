import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import crypto from "node:crypto";

import { User } from "../models/user.js";
import { Session } from "../models/session.js";

function generateSession(userId) {
    return {
        userId,
        accessToken: crypto.randomBytes(30).toString("base64"),
        refreshToken: crypto.randomBytes(30).toString("base64"),
        accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
        refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    };
}

export async function registerUser(payload) {
    const user = await User.findOne({ email: payload.email });

    if (user !== null) {
        throw createHttpError(409, "Email in use");
    };

    payload.password = await bcrypt.hash(payload.password, 10);

    return User.create(payload);
}

export async function loginUser(email, password) {
    const user = await User.findOne({ email });

    if (user === null) {
        throw createHttpError(401, "Email or password is incorrect");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch !== true) {
        throw createHttpError(401, "Email or password is incorrect");
    }

    await Session.deleteOne({ userId: user._id });

    const sessionData = generateSession(user._id);
    return Session.create(sessionData);
}

export async function logoutUser(sessionId) {
    await Session.deleteOne({ _id: sessionId });
}

export async function refreshSession(sessionId, refreshToken) {
    const session = await Session.findById(sessionId);

    if (session === null) {
        throw createHttpError(401, "Session not found");
    }

    if (session.refreshToken !== refreshToken) {
        throw createHttpError(401, "Session not found");
    }

    if (session.refreshTokenValidUntil <= new Date()) {
        throw createHttpError(401, "Refresh token is expired");
    }

    await Session.deleteOne({ _id: session._id });

    const sessionData = generateSession(session.userId);
    return Session.create(sessionData);
}


// import bcrypt from "bcrypt";
// import createHttpError from "http-errors";
// import crypto from "node:crypto";

// import { User } from "../models/user.js";
// import { Session } from "../models/session.js";

// export async function registerUser(payload) {
//     const user = await User.findOne({ email: payload.email });

//     if (user !== null) {
//         throw createHttpError(409, "Email in use");
//     };

//     payload.password = await bcrypt.hash(payload.password, 10);

//     return User.create(payload);
// }

// export async function loginUser(email, password) {
//     const user = await User.findOne({ email });

//     if (user === null) {
//         throw createHttpError(401, "Email or password is incorrect");
//     }

//     const isMatch = await bcrypt.compare(password, user.password);

//     if (isMatch !== true) {
//         throw createHttpError(401, "Email or password is incorrect");
//     }

//     Session.deleteOne({ userId: user._id });

//     return Session.create({
//         userId: user._id,
//         accessToken: crypto.randomBytes(30).toString("base64"),
//         refreshToken: crypto.randomBytes(30).toString("base64"),
//         accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
//         refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
//     });

// }

// export async function logoutUser(sessionId) {
//     await Session.deleteOne({ _id: sessionId });
// }


// export async function refreshSession(sessionId, refreshToken) {
//     const session = await Session.findById(sessionId);

//     if (session === null) {
//         throw createHttpError(401, "Session not found");
//     }

//     if (session.refreshToken !== refreshToken) {
//         throw createHttpError(401, "Session not found");
//     }

//     if (session.refreshTokenValidUntil > new Date()) {
//         throw createHttpError(401, "Refresh token is expired");
//     }

//     await Session.deleteOne({ _id: session._id });

//     Session.create({
//         userId: sessionId,
//         accessToken: crypto.randomBytes(30).toString("base64"),
//         refreshToken: crypto.randomBytes(30).toString("base64"),
//         accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
//         refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
//     });
// }
