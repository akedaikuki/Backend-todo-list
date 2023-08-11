// 設定資料庫連線

// 重構種子資料 完成程式邏輯
const bcrypt = require("bcryptjs");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// const mongoose = require('mongoose')
const Todo = require("../todo"); // 載入 todo model

// 載入 User
const User = require("../user");
// 加入以下 db
const db = require("../../config/mongoose");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// 第一個使用者
const SEED_USER = {
  name: "root",
  email: "root@example.com",
  password: "12345678",
};

// mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
// const db = mongoose.connection
// db.on('error', () => {
//   console.log('mongodb error!')
// })

db.once("open", () => {
  // console.log('mongodb connected!')
  // 新增 10 筆資料
  // for (let i = 0; i < 10; i++) {
  // Todo.create({name:`name-${i}`})
  // 改成以下
  // Todo.create({ name: 'name-' + i })
  // }
  // console.log('done')
  //修給為以下 重構種子資料
  bcrypt
    .genSalt(10)
    .then((salt) => bcrypt.hash(SEED_USER.password, salt))
    .then((hash) =>
      User.create({
        name: SEED_USER.name,
        email: SEED_USER.email,
        password: hash,
      })
    )
    .then((user) => {
      const userId = user._id;
      return Promise.all(
        Array.from({ length: 10 }, (_, i) =>
          Todo.create({ name: `name-${i}`, userId })
        )
      );
    })
    .then(() => {
      console.log("done.");
      process.exit();
    });
});
