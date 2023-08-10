const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// 使用 new Schema() 宣告資料
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
// 匯出設定，讓其他檔案能用 User 來存取 User model 相關資料
module.exports = mongoose.model("User", userSchema);
