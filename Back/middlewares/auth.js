const { verifyToken, generateToken } = require("../util/tokenUtil");

const checkAuthorization = async (req, res, next) => {
  try {
    if (!req.headers.authorization) throw new Error("인증 정보가 존재하지 않습니다");

    const [type, token] = req.headers.authorization.split(" ");
    if (type !== "Bearer") throw new Error("인증 유형이 잘못되었습니다");
    if (token == undefined || !token.length) throw new Error("인증 정보가 존재하지 않습니다");

    const verifiedAccess = verifyToken(token);
    if (!verifiedAccess) throw new Error("액세스 인증에 실패했습니다. 다시 로그인해주세요");

    if (verifiedAccess === "expiredToken") {
      console.log("액세스토큰이 만료되어 유저의 리프레쉬 토큰을 확인합니다");
      const { refreshToken: loginUserRefreshToken } = req.cookies;
      if (loginUserRefreshToken === "no auth") throw new Error("인증에 실패했습니다. 다시 로그인해주세요");

      const verifiedRefresh = verifyToken(loginUserRefreshToken);
      if (verifiedRefresh === "expiredToken") throw new Error("다시 로그인해주세요.");

      const newAccessToken = generateToken(verifiedRefresh.loginId, "access");
      req.accessToken = newAccessToken;
      req.isRenew = true;
    } else {
      console.log("액세스토큰이 만료되지 않아 액세스 토큰만을 확인합니다");
      req.accessToken = token;
      req.isRenew = false;
    }

    next();
  } catch (err) {
    res.status(400).json({ state: false, message: err.message });
  }
};

module.exports = {
  checkAuthorization,
};
