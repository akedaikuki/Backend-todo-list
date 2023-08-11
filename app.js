// 載入 express 並建構應用程式伺服器
const express = require("express");
// // 載入 mongoose
// const mongoose = require('mongoose')
// 載入 handlebars
const exphbs = require("express-handlebars");
// 載入 bodyParser
const bodyParser = require("body-parser");
// 載入 method-override
const methodOverride = require("method-override");
// // 載入 Todo model
// const Todo = require('./models/todo')

// 新增載入 express-session
const session = require("express-session");

// 設定 connect-flash
const flash = require("connect-flash");

// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// 引用路由器
const routes = require("./routes");
require("./config/mongoose");

// 載入設定檔，要寫在 express-session 以後
const usePassport = require("./config/passport");

const app = express();

// // 設定連線到 mongoDB
// // mongoose.connect(process.env.MONGODB_URI) //改成以下
// mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
// // 取得資料庫連線狀態
// const db = mongoose.connection
// // 連線異常
// db.on('error', () => {
//   console.log('mongodb error!')
// })
// // 連線成功
// db.once('open', () => {
//   console.log('mongodb connected!')
// })

// 建立一個名為 hbs 的樣板引擎, 並傳入 exphbs 與相關參數
app.engine("hbs", exphbs({ defaultLayout: "main", extname: ".hbs" }));
// 啟用樣板引擎 hbs
app.set("view engine", "hbs");

// 新增以下 session
app.use(
  session({
    // secret 這個參數是 session 用來驗證 session id 的字串。
    // 第三方串接 "ThisIsMySecret" 改成 以下
    secret: process.env.SESSION_SECRET,
    // 當設定為 true 時，會在每一次與使用者互動後，
    // 強制把 session 更新到 session store 裡。
    resave: false,
    // 強制將未初始化的 session 存回 session store。
    // 未初始化表示這個 session 是新的而且沒有被修改過，
    // 例如未登入的使用者的 session。
    saveUninitialized: true,
  })
);

// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(bodyParser.urlencoded({ extended: true }));

// 設定每一筆請求都會透過 methodOverride 進行前置處理
app.use(methodOverride("_method"));

// 呼叫 Passport 函式並傳入 app，這條要寫在路由之前
usePassport(app);

// 掛載套件 connect-flash
app.use(flash());
// 在路由器前 passport後 導入 設定本地變數 res.locals
// 使用 app.use 代表這組 middleware 會作用於所有的路由
app.use((req, res, next) => {
  // 你可以在這裡 console.log(req.user) 等資訊來觀察
  console.log(req.user);
  // 兩個本地變數
  // res.locals.isAuthenticated = 回傳布林值 交接給 res 使用
  // res.locals.user = 把使用者資料交接給 res 使用
  res.locals.isAuthenticated = req.isAuthenticated();
  // req.user 是哪裡來的？ 是在反序列化的時候，取出的 user 資訊
  res.locals.user = req.user;
  // 設定 success_msg 訊息
  res.locals.success_msg = req.flash("success_msg");
  // 設定 warning_msg 訊息
  res.locals.warning_msg = req.flash("warning_msg");
  next();
});

// 將 request 導入路由器
app.use(routes);

// 設定首頁路由
// app.get('/', (req, res) => {
//   res.send('hello world')
// })

// 重新設定首頁路由
// Todo 首頁
// app.get('/', (req, res) => {
//     // res.render('index')
//     // 再次修改成以下
//     Todo.find()
//     // 取出 Todo model 裡的所有資料 //從資料庫查找資料
//     .lean()
//     .sort({ _id: 'asc' }) // 新增這裡：根據 _id 升冪排序
//     // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
//     //把資料轉成單純的JS物件
//     //撈資料以後想用 res.render()，要先用 .lean() 來處理
//     .then(todos => res.render('index', { todos }))
//     // 將資料傳給 index 樣板 //然後把資料送到前端樣板
//     .catch(error => console.error(error))
//     // 錯誤處理 //如果發生意外, 執行錯誤處理
// })

// app.get('/todos/new', (req, res) => {
//    return res.render('new')
// })

// app.post('/todos', (req, res) => {
//    // 從 req.body 拿出表單裡的 name 資料
//    const name = req.body.name

//    // 作法二 (先產生物件實例,再把實例存入 Todo　)
//    const todo = new Todo({ name })
//    return todo.save()

//    // 作法一 (直接操作 Todo)
//    // 存入資料庫
// //    return Todo.create({ name })
//       // 新增完成後導回首頁
//      .then(() => res.redirect('/'))
//      .catch(error => console.log(error))
// })

// 新增 預覽特定 Todo 路由
// app.get('/todos/:id', (req, res) => {
//     const id = req.params.id
//     return Todo.findById(id)
//       .lean()
//       .then(todo => res.render('detail', { todo }))
//       .catch(error => console.log(error))
// })

// 新增 Edit 頁面 讓使用者修改表單
// app.get('/todos/:id/edit', (req, res) => {
//     const id = req.params.id
//     return Todo.findById(id)
//       .lean()
//       .then(todo => res.render('edit', { todo }))
//       .catch(error => console.log(error))
// })

// app.put('/todos/:id', (req, res) => {
//     const id = req.params.id
//     const { name, isDone } = req.body
//     // 1.查詢資料
//     return Todo.findById(id)
//     // 2.重新儲存資料
//       .then(todo => {
//         todo.name = name
//         // 優先執行邏輯運算子 isDone === 'on' // 回傳 true
//         // 再執行賦值運算子 todo.isDone = true
//         todo.isDone = isDone === 'on'
//         return todo.save()
//       })
//       // 3.如果儲存成功 導向首頁
//       .then(() => res.redirect(`/todos/${id}`))
//       .catch(error => console.log(error))
// })

// 設定 刪除的路由
// app.delete('/todos/:id', (req, res) => {
//     const id = req.params.id
//     return Todo.findById(id)
//       .then(todo => todo.remove())
//       .then(() => res.redirect('/'))
//       .catch(error => console.log(error))
//   })

// 設定 port 3000
// app.listen(3000, () => {
//   console.log('App is running on http://localhost:3000')
// })

// 修改環境設定
// app.js
// 如果在 Heroku 環境則使用 process.env.PORT
// 否則為本地環境，使用 3000
// 第三方連接後 可以不要 || 3000
const PORT = process.env.PORT;
// 設定應用程式監聽的埠號
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`);
});
