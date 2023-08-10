const express = require("express");
const router = express.Router();

// 引入 User model
const User = require("../../models/user");

// 路由設定清單，這裡我們先簡單加入一條「登入表單頁面」的路由
router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", (req, res) => {});

// 新增註冊頁面
router.get("/register", (req, res) => {
  res.render("register");
});

// 實作註冊功能
router.post("/register", (req, res) => {
  // 取得註冊表單參數
  const { name, email, password, confirmPassword } = req.body;
  // 檢查使用者是否已經註冊
  User.findOne({ email })
    .then((user) => {
      // 如果已經註冊：退回原本畫面
      if (user) {
        console.log("User already exists.");
        res.render("register", {
          // 再附上表單參數
          name,
          email,
          password,
          confirmPassword,
        });
      } else {
        // 新使用者：創建資料
        // 如果還沒註冊：寫入資料庫
        return User.create({
          name,
          email,
          password,
        })
          .then(() => res.redirect("/"))
          .catch((err) => console.log(err));
      }
    })
    .catch((err) => console.log(err));
});

// 匯出路由模組
module.exports = router;
