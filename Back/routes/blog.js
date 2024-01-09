const express = require("express");
const mysql = require("../mysql");
const { checkAuthorization } = require("../middlewares/auth");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { page = 1 } = req.query;
    // const getBlogListRes = await mysql.query("findBlogsByUserId", req.verifiedToken.loginId);
    // const getBlogListRes = await mysql.query("findAllBlogs");
    const blogCountRes = await mysql.query("getBlogsCount");
    const getBlogListRes = await mysql.query("findBlogsByLimit", [8, (Number(page) - 1) * 8]);
    res.status(201).json({
      state: true,
      message: "게시글 목록 조회에 성공했습니다",
      blogList: getBlogListRes,
      blogCount: blogCountRes[0].blog_count,
    });
  } catch (err) {
    res.status(400).json({ state: false, message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (id) {
      const getBlogDetailRes = await mysql.query("findBlogByBlogId", id);
      if (!getBlogDetailRes.length) throw new Error("게시글 조회에 실패했습니다");
      // if (getBlogDetailRes[0].login_id !== req.verifiedToken.loginId) throw new Error("권한이 없는 접근입니다");
      res.status(201).json({ state: true, message: "게시글 조회에 성공했습니다", blogData: getBlogDetailRes[0] });
    }
  } catch (err) {
    res.status(400).json({ state: false, message: err.message });
  }
});

router.post("/", checkAuthorization, async (req, res) => {
  try {
    const blogData = { login_id: req.verifiedToken.loginId, ...req.body };
    const insertBlogRes = await mysql.query("insertBlog", blogData);
    if (!insertBlogRes.affectedRows) throw new Error("게시글 저장에 실패했습니다. 다시 시도해주세요");

    res.status(201).json({ state: true, message: "게시글 등록에 성공했습니다", blog_id: insertBlogRes.insertId });
  } catch (err) {
    res.status(400).json({ state: false, message: err.message });
  }
});

router.patch("/:id", checkAuthorization, async (req, res) => {
  try {
    const { id } = req.params;
    const [{ login_id: writer }] = await mysql.query("findLoginIdByBlogId", id);
    const { loginId: currentUser } = req.verifiedToken;
    if (writer !== currentUser) throw new Error("게시글을 수정할 권한이 없습니다.");
    const updatedData = req.body;
    const updateBlogRes = await mysql.query("updateBlog", [updatedData, id]);
    if (!updateBlogRes.affectedRows) throw new Error("게시글 수정에 실패했습니다. 다시 시도해주세요");

    res.status(201).json({ state: true, message: "게시글 수정에 성공했습니다", blog_id: id });
  } catch (err) {
    res.status(400).json({ state: false, message: err.message });
  }
});

router.delete("/:id", checkAuthorization, async (req, res) => {
  try {
    const { id } = req.params;
    const [{ login_id: writer }] = await mysql.query("findLoginIdByBlogId", id);
    const { loginId: currentUser } = req.verifiedToken;
    if (writer !== currentUser) throw new Error("게시글을 삭제할 권한이 없습니다.");
    const deleteBlogRes = await mysql.query("deleteBlog", id);

    if (!deleteBlogRes.affectedRows) throw new Error("게시글 삭제에 실패했습니다. 다시 시도해주세요");

    res.status(201).json({ state: true, message: "게시글 삭제에 성공했습니다" });
  } catch (err) {
    res.status(400).json({ state: false, message: err.message });
  }
});

module.exports = router;
