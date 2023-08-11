// 載入相關模組
// 首先載入 LocalStrategy模組。
const passport = require("passport");
// passport 指定寫法： .Strategy
const LocalStrategy = require("passport-local").Strategy;

// 引用 Facebook 登入策略
const FacebookStrategy = require("passport-facebook").Strategy;

// 引用 bcrypt
const bcrypt = require("bcryptjs");

// 用到 User.findOne 不要忘記載入  User model。
const User = require("../models/user");

// module.exports 並初始化套件
module.exports = (app) => {
  // 初始化 Passport 模組
  app.use(passport.initialize());
  app.use(passport.session());
  // 設定本地登入策略
  // 把 callback 語法改寫成 Promise 風格，
  // 也就是在資料庫操作後加上 .then，並且把錯誤處理移到 .catch 裡
  passport.use(
    // 把驗證項目從預設的 username 改成 email。
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      User.findOne({ email })
        .then((user) => {
          if (!user) {
            return done(null, false, {
              message: "That email is not registered!",
            });
          }
          // if (user.password !== password) {
          //   return done(null, false, {
          //     message: "Email or Password incorrect.",
          //   });
          // }
          // return done(null, user);
          // 密碼比對：bcrypt.compare
          // (password, user.password)
          // 第一個參數 password 是使用者的輸入值，
          // 而第二個參數 user.password 是資料庫裡的雜湊值
          return bcrypt.compare(password, user.password).then((isMatch) => {
            if (!isMatch) {
              return done(null, false, {
                message: "Email or Password incorrect.",
              });
            }
            return done(null, user);
          });
        })
        .catch((err) => done(err, false));
    })
  );
  //
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_ID, //'你的應用程式編號',
        clientSecret: process.env.FACEBOOK_SECRET, //'你的應用程式密鑰',
        callbackURL: process.env.FACEBOOK_CALLBACK, //'http://localhost:3000/auth/facebook/callback',
        profileFields: ["email", "displayName"], // 這個設定是和 Facebook 要求開放的資料
      },
      (accessToken, refreshToken, profile, done) => {
        // console.log(profile);
        const { name, email } = profile._json;
        User.findOne({ email }).then((user) => {
          if (user) return done(null, user);

          const randomPassword = Math.random().toString(36).slice(-8);
          bcrypt
            .genSalt(10)
            .then((salt) => bcrypt.hash(randomPassword, salt))
            .then((hash) =>
              User.create({
                name,
                email,
                password: hash,
              })
            )
            .then((user) => done(null, user))
            .catch((err) => done(err, false));
        });
      }
    )
  );

  // 設定序列化與反序列化
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  // 依照 Promise 風格用 .then().catch() 來控制流程
  passport.deserializeUser((id, done) => {
    User.findById(id)
      // 先用 .lean() 把資料庫物件轉換成 JavaScript 原生物件。
      .lean()
      .then((user) => done(null, user))
      .catch((err) => done(err, null));
  });
};
