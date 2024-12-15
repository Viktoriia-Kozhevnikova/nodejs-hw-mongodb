import * as fs from "node:fs";
import path from "node:path";
import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import handlebars from "handlebars";

import { User } from "../models/user.js";
import { Session } from "../models/session.js";
import { sendMail } from "../utils/sendMail.js";


const RESET_PASSWORD_TEMPLATE = fs.readFileSync(path.resolve("src/templates/reset-password.hbs"), { encoding: "utf8" });

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

export async function requestResetPassword(email) {
    const user = await User.findOne({ email });

    if (user === null) {
        throw createHttpError(404, "User not found!");
    }

    const resetToken = jwt.sign({ sub: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "5m" });

    const html = handlebars.compile(RESET_PASSWORD_TEMPLATE);

    try {
        await sendMail({
            from: process.env.SMTP_FROM,
            to: user.email,
            subject: "Reset password",
            html: html({ APP_DOMAIN: process.env.APP_DOMAIN, resetToken })
        });
    } catch {
        throw createHttpError(500, "Failed to send the email, please try again later.");
    }
}


export async function resetPassword(newPassword, token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findOne({ _id: decoded.sub, email: decoded.email });

        if (user === null) {
            throw createHttpError(404, "User not found!");
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await User.findByIdAndUpdate(user._id, { password: hashedPassword});

    } catch (error) {
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            throw createHttpError(401, "Token is expired or invalid.");
        }

        throw error;
    }
}
