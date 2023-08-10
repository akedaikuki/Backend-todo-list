const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const todoSchema = new Schema({
  name: {
    type: String, // 資料型別是字串
    required: true, // 這是個必填欄位
  },
  isDone: {
    type: Boolean,
    default: false,
  },
  // Todo Model 加入 userId
  userId: {
    // 加入關聯設定
    // type = 定義 userId 這個項目是一個 ObjectId，
    // 也就是它會連向另一個資料物件
    // ref = 定義參考對象是 User model
    type: Schema.Types.ObjectId,
    ref: "User",
    index: true,
    required: true,
  },
});
module.exports = mongoose.model("Todo", todoSchema);
