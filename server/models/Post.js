const { Schema, model } = require("mongoose");

const Post = new Schema({
  title: { type: String, unique: true, required: true },
  description: { type: String, required: true },
  image: [{ type: String, default: 'uploads/default/not_img.jpg' }], 
  price: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'RUB' }, 
  category: { type: String, required: true },
  subcategory: { type: String, required: false },
  subsubcategory: { type: String, required: false },
  author: { type: String, required: true },
  location: { type: String, required: true }, 
  contact_name: { type: String, required: true }, 
  contact_methods: [{ type: String }], 
  phone: { type: String, required: true }, 
  additional_fields: { type: Schema.Types.Mixed, default: {} },
  comments: [{
    text: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'USER', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
  }],
  messages: [{
    text: { type: String, required: true },
    sender: { type: Schema.Types.ObjectId, ref: 'USER', required: true },
    recipient: { type: Schema.Types.ObjectId, ref: 'USER', required: true },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = model("Post", Post);