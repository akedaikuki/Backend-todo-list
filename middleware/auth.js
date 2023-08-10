// 其中的 req.isAuthenticated() 是 Passport.js 提供的函式，
// 會根據 request 的登入狀態回傳 true 或 false。
// 如果 req.isAuthenticated() 回傳 true，則我們執行下一個 middleware，
// 通常就會進入路由的核心功能，如果是 false，就強制返回 login 頁面。
module.exports = {
  authenticator: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    // 新增以下 警告訊息：未登入不能使用網站
    req.flash("warning_msg", "請先登入才能使用！");
    res.redirect("/users/login");
  },
};
