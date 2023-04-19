// 載入 express 並建構應用程式伺服器
const express = require('express')
// 載入 mongoose
const mongoose = require('mongoose') 
// 載入 handlebars
const exphbs = require('express-handlebars')
// 載入 Todo model
const Todo = require('./models/todo') 
// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }

const app = express()

// 設定連線到 mongoDB
// mongoose.connect(process.env.MONGODB_URI) //改成以下
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')



// 設定首頁路由
// app.get('/', (req, res) => {
//   res.send('hello world')
// })

// 重新設定首頁路由
// Todo 首頁
app.get('/', (req, res) => {
    // res.render('index')
    // 再次修改成以下
    Todo.find() 
    // 取出 Todo model 裡的所有資料 //從資料庫查找資料
    .lean() 
    // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列 
    //把資料轉成單純的JS物件 
    //撈資料以後想用 res.render()，要先用 .lean() 來處理
    .then(todos => res.render('index', { todos })) 
    // 將資料傳給 index 樣板 //然後把資料送到前端樣板
    .catch(error => console.error(error)) 
    // 錯誤處理 //如果發生意外, 執行錯誤處理
})

// 設定 port 3000
app.listen(3000, () => {
  console.log('App is running on http://localhost:3000')
})