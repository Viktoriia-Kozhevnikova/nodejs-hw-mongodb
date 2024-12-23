import { registerUser, loginUser, logoutUser, refreshSession, requestResetPassword, resetPassword, loginOrRegister } from "../services/auth.js";
import { generateOAuthURL, validateCode } from "../utils/googleOAuth2.js";


function setSessionCookies(res, session) {
    res.cookie("sessionId", session._id, {
        httpOnly: true,
        expires: session.refreshTokenValidUntil,
    });

    res.cookie("refreshToken", session.refreshToken, {
        httpOnly: true,
        expires: session.refreshTokenValidUntil,
    });
}

export async function registerController(req, res) {
    const payload = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    };

    const registeredUser = await registerUser(payload);

    res.send({status: 201, message: "Successfully registered a user!", data: registeredUser});

}

export async function loginController(req, res) {
    const { email, password } = req.body;

    const session = await loginUser(email, password);

    setSessionCookies(res, session);

    res.send({
        status: 200,
        message: "Successfully logged in an user!",
        data: { accessToken: session.accessToken },
    });
}

export async function logoutController(req, res) {
    const { sessionId } = req.cookies;

    if (typeof sessionId === "string") {
        await logoutUser(sessionId);
    }

    res.clearCookie("sessionId");
    res.clearCookie("refreshToken");

    res.status(204).end();
}

export async function refreshController(req, res) {
    const { sessionId, refreshToken } = req.cookies;

    const session = await refreshSession(sessionId, refreshToken);

    setSessionCookies(res, session);

    res.send({
        status: 200,
        message: "Successfully refreshed a session!",
        data: { accessToken: session.accessToken },
    });
}


export async function requestResetPasswordController(req, res) {
    const { email } = req.body;

    await requestResetPassword(email);

    res.send({
        status: 200,
        message: "Reset password email has been successfully sent.",
        data: {}
    });
}


export async function resetPasswordController(req, res) {
    const { password, token } = req.body;

    await resetPassword(password, token);

    res.send({
       status: 200,
       message: "Password has been successfully reset.",
       data: {}
   });
}


export async function getOAuthURLController(req, res) {
    const url = generateOAuthURL();
    res.send({
        status: 200,
        message: "Successfully get Google OAuth URL",
        data: url
    });
}


export async function confirmOAuthController(req, res) {
    const { code } = req.body;

    const ticket = await validateCode(code);
    const session = await loginOrRegister(ticket.payload);

    setSessionCookies(res, session);

    res.send({
        status: 200,
        message: "Login with  Google successfully",
        data: { accessToken: session.accessToken },
    });
}
