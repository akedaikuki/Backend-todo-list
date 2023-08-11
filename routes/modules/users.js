const express = require("express");
const router = express.Router();

// 引入 User model
const User = require("../../models/user");

// 引用 passport
const passport = require("passport");

// 引用 bcrypt
const bcrypt = require("bcryptjs");

// 路由設定清單，這裡我們先簡單加入一條「登入表單頁面」的路由
router.get("/login", (req, res) => {
  res.render("login");
});

// router.post("/login", (req, res) => {});
// 修改成以下
// 加入 middleware，驗證 request 登入狀態
// 用 Passport 提供的 authenticate 方法執行認證。
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
  })
);

// 新增註冊頁面
router.get("/register", (req, res) => {
  res.render("register");
});

// 實作註冊功能
router.post("/register", (req, res) => {
  // 取得註冊表單參數
  const { name, email, password, confirmPassword } = req.body;

  const errors = [];

  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: "所有欄位都是必填。" });
  }
  if (password !== confirmPassword) {
    errors.push({ message: "密碼與確認密碼不相符！" });
  }
  if (errors.length) {
    return res.render("register", {
      errors,
      name,
      email,
      password,
      confirmPassword,
    });
  }

  // 檢查使用者是否已經註冊
  User.findOne({ email }).then((user) => {
    // 如果已經註冊：退回原本畫面
    if (user) {
      // console.log("User already exists.");
      // res.render("register", {
      // 修改為以下 警告訊息
      errors.push({ message: "這個 Email 已經註冊過了。" });
      return res.render("register", {
        errors,
        // 再附上表單參數
        name,
        email,
        password,
        confirmPassword,
      });
      // } else {
      //   // 新使用者：創建資料
      //   // 如果還沒註冊：寫入資料庫
      //   return User.create({
      //     name,
      //     email,
      //     password,
      //   })
      //     .then(() => res.redirect("/"))
      //     .catch((err) => console.log(err));
    }
    // 追加以下
    // return User.create({
    //   name,
    //   email,
    //   password,
    // })
    // 再次修給成以下 用 bcrypt 處理密碼：註冊篇
    return bcrypt
      .genSalt(10) // 產生「鹽」，並設定複雜度係數為 10
      .then((salt) =>
        // console.log("salt:", salt);
        bcrypt.hash(password, salt)
      ) // 為使用者密碼「加鹽」，產生雜湊值
      .then((hash) =>
        // console.log("hash:", hash);
        User.create({
          name,
          email,
          password: hash, // 用雜湊值取得原本的使用者密碼
        })
      )
      .then(() => res.redirect("/"))
      .catch((err) => console.log(err));
  });
});

// 新增登出路由
router.get("/logout", (req, res) => {
  req.logout();
  // 新增登出消息
  req.flash("success_msg", "你已經成功登出。");
  res.redirect("/users/login");
});

// 匯出路由模組
module.exports = router;
