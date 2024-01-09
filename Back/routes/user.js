const express = require("express");
const mysql = require("../mysql");
const { createHashedPassword, verifyPassword } = require("../util/encryptUtil");
const { generateToken } = require("../util/tokenUtil");

const router = express.Router();
router.get("/", async (req, res) => {
  res.send("get");
});

// 회원가입 '/user/signup'
router.post("/signup", async (req, res) => {
  try {
    const { id, password } = req.body;
    const { hashedPassword, salt } = await createHashedPassword(password);

    const findUserRes = await mysql.query("findUserById", id);
    const isExisting = findUserRes.length;

    if (isExisting) {
      throw new Error("유저가 이미 존재합니다");
    }

    const insertUserRes = await mysql.query("insertUser", {
      login_id: id,
      hashed_pw: hashedPassword,
      salt,
    });

    if (!insertUserRes.affectedRows) {
      throw new Error("회원가입에 실패했습니다. 다시 시도해주세요.");
    }

    res.status(201).json({ state: true, message: "회원가입 성공입니다" });
  } catch (err) {
    res.status(400).json({ state: false, message: err.message });
  }
});

// 로그인 '/user/login'
router.post("/login", async (req, res) => {
  try {
    const { id, password } = req.body;
    const userData = await mysql.query("findUserById", id);

    if (!userData.length) {
      throw new Error("아이디 혹은 비밀번호를 확인하세요");
    }

    const { hashed_pw, salt } = userData[0];
    const isMatching = await verifyPassword(password, salt, hashed_pw);

    if (!isMatching) {
      throw new Error("아이디 혹은 비밀번호를 확인하세요");
    }

    const accessToken = generateToken(id, "access");
    const refreshToken = generateToken(id, "refresh");

    const updateUserToken = await mysql.query("updateUser", [{ refresh_token: refreshToken }, id]);
    if (!updateUserToken.affectedRows) throw new Error("로그인에 실패했습니다");

    res.cookie("refreshToken", refreshToken);
    res.status(201).json({ state: true, message: "로그인 성공입니다", accessToken, loginId: id });
  } catch (err) {
    res.status(400).json({ state: false, message: err.message });
  }
});

// 로그아웃 '/user/login'
router.post("/logout", async (req, res) => {
  try {
    const { id } = req.body;

    res.clearCookie("refreshToken");

    const response = await mysql.query("logoutUser", id);
    if (!response.affectedRows) throw new Error("로그아웃 실패입니다");

    res.status(201).json({ state: true, message: "로그아웃 성공입니다" });
  } catch (err) {
    res.status(400).json({ state: false, message: err.message });
  }
  // {
  //   fieldCount: 0,
  //   affectedRows: 1,
  //   insertId: 0,
  //   serverStatus: 2,
  //   warningCount: 0,
  //   message: '(Rows matched: 1  Changed: 1  Warnings: 0',
  //   protocol41: true,
  //   changedRows: 1
  // }
});

module.exports = router;
