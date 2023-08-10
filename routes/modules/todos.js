const express = require("express");
const router = express.Router();
const Todo = require("../../models/todo");

router.get("/new", (req, res) => {
  return res.render("new");
});

router.post("/", (req, res) => {
  // 增加以下 設定 Todo 與 User 資料關聯
  const userId = req.user._id;
  const name = req.body.name;
  // 新增, userId
  return Todo.create({ name, userId })
    .then(() => res.redirect("/"))
    .catch((error) => console.log(error));
});

router.get("/:id", (req, res) => {
  // const id = req.params.id;
  // return Todo.findById(id)
  // 修改為以下 設定 Todo 與 User 資料關聯

  // 確保這筆 todo 屬於目前登入的 user
  const userId = req.user._id;
  // 先找出 _id 一樣的 todo
  const _id = req.params.id;
  return Todo.findOne({ _id, userId })
    .lean()
    .then((todo) => res.render("detail", { todo }))
    .catch((error) => console.log(error));
});

router.get("/:id/edit", (req, res) => {
  // const id = req.params.id;
  // return Todo.findById(id)
  // 修改為以下 設定 Todo 與 User 資料關聯
  const userId = req.user._id;
  const _id = req.params.id;
  return Todo.findOne({ _id, userId })
    .lean()
    .then((todo) => res.render("edit", { todo }))
    .catch((error) => console.log(error));
});

router.put("/:id", (req, res) => {
  // const id = req.params.id;
  // 修改為以下 設定 Todo 與 User 資料關聯
  const userId = req.user._id;
  const _id = req.params.id;
  const { name, isDone } = req.body;
  // 把 findById(id) 修改成 findOne({ _id, userId })
  return (
    Todo.findOne({ _id, userId })
      .then((todo) => {
        todo.name = name;
        todo.isDone = isDone === "on";
        return todo.save();
      })
      // id 改成 _id
      .then(() => res.redirect(`/todos/${_id}`))
      .catch((error) => console.log(error))
  );
});

router.delete("/:id", (req, res) => {
  // const id = req.params.id;
  // return Todo.findById(id)
  // 修改為以下 設定 Todo 與 User 資料關聯
  const userId = req.user._id;
  const _id = req.params.id;
  return Todo.findOne({ _id, userId })
    .then((todo) => todo.remove())
    .then(() => res.redirect("/"))
    .catch((error) => console.log(error));
});

module.exports = router;
