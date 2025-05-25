const { Schema, model } = require("mongoose");

const User = new Schema({
  name: { type: String, required: true },
  userlogin: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  registrationDate: { type: Date, default: Date.now },
  avatar: {type: String, default: 'uploads/not_img.jpg'},
  roles: [{type: String, ref: "Role"}]
});

module.exports = model("USER", User);
