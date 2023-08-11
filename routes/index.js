// 引用 Express 與 Express 路由器
const express = require("express");
const router = express.Router();
// 引入 home 模組程式碼
const home = require("./modules/home");
// 引入 todos 模組程式碼
const todos = require("./modules/todos");

// 追加 以下 引入 users 模組
const users = require("./modules/users"); // add this

// 載入 auth 模組
const auth = require("./modules/auth");

// 掛載 middleware
const { authenticator } = require("../middleware/auth");

// 將網址結構符合 /todos 字串開頭的 request 導向 todos 模組
// 加入驗證程序
router.use("/todos", authenticator, todos);

// 追加以下 導向 users 模組
router.use("/users", users); // add this

//掛載 auth 模組
router.use("/auth", auth);

// 將網址結構符合 / 字串的 request 導向 home 模組
// 加入驗證程序
// 由於按照「由上而下」的執行順序 要把 home 路由器 移到最下方
router.use("/", authenticator, home);

// 準備引入路由模組
// 匯出路由器
module.exports = router;
