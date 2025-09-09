// server/routes/authRoutes.js (ESM)
import express from "express";
import * as authController from "../controllers/authController.js";
import jwtAuth from "../middleware/authMiddleware.js";
 
const router = express.Router();

// serve auth configuration to frontend
router.get("/config", authController.getAuthConfig);

/*
  Public auth endpoints
*/
router.post("/register", authController.register);
router.post("/login", authController.login);

/*
  Password reset flow
  - POST /forgot-password  { email }        -> sends reset email (generic response)
  - POST /reset-password   { token, password } -> resets password and logs user in
*/
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

/*
  OAuth entry points (frontend expects /auth/google, /auth/github, /auth/apple)
  These are lightweight placeholders. For production you should replace them
  with a proper OAuth implementation (e.g. Passport, or your own redirect flow)
  that issues tokens or sets cookies after successful auth.
*/
const oauthRedirectMap = {
  google: process.env.OAUTH_GOOGLE_URL || null,
  github: process.env.OAUTH_GITHUB_URL || null,
  apple: process.env.OAUTH_APPLE_URL || null,
};

const makeOAuthHandler = (provider) => (req, res) => {
  const redirectTo = oauthRedirectMap[provider];
  if (redirectTo) {
    // Redirect to configured provider endpoint (could be an endpoint on your backend that starts OAuth)
    return res.redirect(redirectTo);
  }

  // Not implemented — return a clear HTTP error so callers know to implement OAuth
  return res.status(501).json({
    message: `OAuth for "${provider}" is not implemented on the server. Set OAUTH_${provider.toUpperCase()}_URL or implement the provider flow.`,
  });
};

router.get("/google", makeOAuthHandler("google"));
router.get("/github", makeOAuthHandler("github"));
router.get("/apple", makeOAuthHandler("apple"));

/*
  Protected route - returns current user info (requires jwtAuth middleware)
*/
router.get("/me", jwtAuth, authController.getCurrentUser);

export default router;
