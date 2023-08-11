const express = require("express");
const router = express.Router();

const passport = require("passport");

// 向 Facebook 發出請求
router.get(
  "/facebook",
  passport.authenticate("facebook", {
    // 以下向 Facebook 要求的資料
    scope: ["email", "public_profile"],
  })
);

// Facebook 把資料發回來的地方
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "users/login",
  })
);

module.exports = router;
