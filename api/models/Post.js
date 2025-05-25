const { Schema, model } = require("mongoose");

const Post = new Schema({
  title: { type: String, unique: true, required: true },
  description: {type: String , required: true },
  image: { type: String, default: '/uploads/not_img.jpg'},
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true},
  author: {type: String, required: true}
}, {timestamps: true});

module.exports = model("Post", Post);
