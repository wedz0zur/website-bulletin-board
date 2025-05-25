const Post = require("../models/Post");
const User = require("../models/User");

class PostController {
  async addPost(req, res) {
    try {
      const { title, price, description, category, author } = req.body;

      let imagePaths = "";
      if (req.files && req.files.length > 0) {
        req.files.forEach((file) => {
          imagePaths += file.path + ",";
        });
        imagePaths = imagePaths.slice(0, -1);
      }
      const post = new Post({
        title,
        description,
        price,
        category,
        author,
        image: imagePaths,
      });

      await post.save();
      return res.status(200).json("Продукт успешно добавлен!");
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Ошибка добавления продукта" });
    }
  }

  async deleteOnePost(req, res) {
    try {
      const postId = req.params.id;
      const userId = req.user.id;

      const post = await Post.findById(postId);

      if (!post) {
        return res.status(404).json({ message: "Пост не найден" });
      }

      if (post.author !== userId) {
        return res.status(403).json({ message: "Вы не автор этого поста" });
      }

      await Post.findByIdAndDelete(postId);
      return res.status(200).json({ message: "Пост успешно удалён" });
    } catch (e) {
      console.error("Ошибка при удалении поста:", e.message);
      return res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
  }

  async getUserPosts(req, res) {
    try {
      const userId = req.user.id;
      const posts = await Post.find({ author: userId }).sort({ createdAt: -1 });
      res.json(posts);
    } catch (e) {
      console.error(e);
      res
        .status(500)
        .json({ message: "Ошибка при получении объявлений пользователя" });
    }
  }

  async getPosts(req, res) {
    try {
      const posts = await Post.find();
      res.json(posts);
    } catch (e) {}
  }

  async getOnePost(req, res) {
    console.log(req.params);

    try {
      const id = req.params.id;
      const post = await Post.findById({ _id: id });
      res.json(post);
    } catch (e) {}
  }

async updatePost(req, res) {
  try {
    const id = req.params.id;
    const userId = req.user.id;
    const { title, price, description } = req.body;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Пост не найден" });
    }

    if (post.author.toString() !== userId) {
      return res.status(403).json({ message: "Вы не автор этого поста" });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { title, price, description },
      { new: true }
    );

    res.status(200).json({ message: "Пост успешно обновлён", updatedPost });
  } catch (e) {
    console.error("Ошибка при обновлении поста:", e);
    res.status(500).json({ message: "Ошибка обновления поста" });
  }
}

}

module.exports = new PostController();
