import AuthenticationError from "../exceptions/authentication-error.js";
import TokenManager from "../security/token-manager.js";
import response from "../utils/response.js";

async function authenticateToken(req, res, next) {
  const token = req.headers.authorization;
  if (token && token.indexOf("Bearer ") !== -1) {
    try {
      const user = await TokenManager.verifyAccessToken(
        token.split("Bearer ")[1],
        process.env.ACCESS_TOKEN_KEY,
      );
      req.user = user;
      return next();
    } catch (error) {
      return response(res, 401, error.message, null);
    }
  }
  return next(new AuthenticationError("Kredensial tidak valid"));
}

export default authenticateToken;
