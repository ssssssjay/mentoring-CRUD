const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET; // 환경변수화 필요

const generateToken = (loginId, type) => {
  if (type === "refresh") {
    return jwt.sign({ loginId }, SECRET_KEY, {
      // expiresIn: "7000",
      expiresIn: "7d",
    });
  }
  if (type === "access") {
    return jwt.sign({ loginId }, SECRET_KEY, {
      // expiresIn: "1000",
      expiresIn: "1h",
    });
  }
};

const verifyToken = (token) => {
  const verified = jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return "expiredToken";
      }
      return null;
    } else {
      return decoded;
    }
  });
  return verified;
};

module.exports = {
  generateToken,
  verifyToken,
};
