const Post = require("../models/Post");
const User = require("../models/User");

class PostController {
  async addPost(req, res) {
    try {
      const {
        title,
        price,
        description,
        category,
        subcategory,
        subsubcategory,
        currency,
        location,
        contact_name,
        contact_methods,
        phone,
        additional_fields,
        author,
      } = req.body;

      if (!author) {
        return res
          .status(400)
          .json({ message: "Идентификатор автора отсутствует" });
      }

      const user = await User.findById(author);
      if (!user) {
        return res.status(400).json({ message: "Пользователь не найден" });
      }

      let parsedContactMethods;
      let parsedAdditionalFields;
      try {
        parsedContactMethods = JSON.parse(contact_methods);
        parsedAdditionalFields = JSON.parse(additional_fields || "{}");
      } catch (e) {
        return res.status(400).json({
          message: "Некорректный формат contact_methods или additional_fields",
        });
      }

      const imagePaths = [];
      if (req.files && req.files.length > 0) {
        req.files.forEach((file) => {
          imagePaths.push(file.path.replace(/\\/g, "/"));
        });
      } else {
        imagePaths.push("uploads/default/not_img.jpg");
      }

      const post = new Post({
        title,
        description,
        price: parseFloat(price),
        image: imagePaths,
        category,
        subcategory: subcategory || "",
        subsubcategory: subsubcategory || "",
        author,
        currency: currency || "RUB",
        location,
        contact_name,
        contact_methods: parsedContactMethods,
        phone,
        additional_fields: parsedAdditionalFields,
      });

      await post.save();
      return res.status(201).json({ message: "Пост успешно добавлен!", post });
    } catch (e) {
      return res
        .status(500)
        .json({ message: `Ошибка добавления поста: ${e.message}` });
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

  getPosts = async (req, res) => {
    try {
      const query = req.query.query;

      let posts;
      if (query) {
        const regex = new RegExp('^' + query, 'i'); 
        posts = await Post.find({ title: { $regex: regex } }).limit(10);
      } else {
        posts = await Post.find().limit(10);
      }

      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  };

  async getOnePost(req, res) {
    try {
      const id = req.params.id;
      const post = await Post.findById(id).populate('comments.author', 'name');
      if (!post) {
        return res.status(404).json({ message: "Пост не найден" });
      }
      res.json(post);
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Ошибка при получении поста" });
    }
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

      if (post.author !== userId) {
        return res.status(403).json({ message: "Вы не автор этого поста" });
      }
      const updatedPost = await Post.findByIdAndUpdate(
        id,
        { title, price: parseFloat(price), description },
        { new: true }
      );

      res.status(200).json({ message: "Пост успешно обновлён", updatedPost });
    } catch (e) {
      console.error("Ошибка при обновлении поста:", e);
      res.status(500).json({ message: "Ошибка обновления поста" });
    }
  }

  async addComment(req, res) {
    try {
      const postId = req.params.id;
      const userId = req.user.id;
      const { text } = req.body;

      if (!text) {
        return res.status(400).json({ message: "Текст комментария обязателен" });
      }

      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Пост не найден" });
      }

      const comment = {
        text,
        author: userId,
        createdAt: new Date()
      };

      post.comments.push(comment);
      await post.save();

      const updatedPost = await Post.findById(postId).populate('comments.author', 'name');
      res.status(201).json({ message: "Комментарий добавлен", post: updatedPost });
    } catch (e) {
      console.error("Ошибка при добавлении комментария:", e);
      res.status(500).json({ message: "Ошибка сервера" });
    }
  }

  async deleteComment(req, res) {
    try {
      const postId = req.params.postId;
      const commentId = req.params.commentId;
      const userId = req.user.id;

      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Пост не найден" });
      }

      const comment = post.comments.id(commentId);
      if (!comment) {
        return res.status(404).json({ message: "Комментарий не найден" });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "Пользователь не найден" });
      }

      const isAdmin = user.roles.includes("ADMIN");
      if (comment.author.toString() !== userId && !isAdmin) {
        return res.status(403).json({ message: "Вы не можете удалить этот комментарий" });
      }

      post.comments = post.comments.filter(c => c._id.toString() !== commentId);
      await post.save();

      const updatedPost = await Post.findById(postId).populate('comments.author', 'name');
      res.status(200).json({ message: "Комментарий удалён", post: updatedPost });
    } catch (e) {
      console.error("Ошибка при удалении комментария:", e);
      res.status(500).json({ message: "Ошибка сервера" });
    }
  }

  async editComment(req, res) {
    try {
      const postId = req.params.postId;
      const commentId = req.params.commentId;
      const userId = req.user.id;
      const { text } = req.body;

      if (!text) {
        return res.status(400).json({ message: "Текст комментария обязателен" });
      }

      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Пост не найден" });
      }

      const comment = post.comments.id(commentId);
      if (!comment) {
        return res.status(404).json({ message: "Комментарий не найден" });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "Пользователь не найден" });
      }

      const isAdmin = user.roles.includes("ADMIN");
      if (comment.author.toString() !== userId && !isAdmin) {
        return res.status(403).json({ message: "Вы не можете редактировать этот комментарий" });
      }

      comment.text = text;
      comment.updatedAt = new Date();
      await post.save();

      const updatedPost = await Post.findById(postId).populate('comments.author', 'name');
      res.status(200).json({ message: "Комментарий обновлён", post: updatedPost });
    } catch (e) {
      console.error("Ошибка при редактировании комментария:", e);
      res.status(500).json({ message: "Ошибка сервера" });
    }
  }

  async addToFavorites(req, res) {
    try {
      const userId = req.user.id;
      const { postId } = req.params;

      const user = await User.findById(userId);
      if (!user.favorites.includes(postId)) {
        user.favorites.push(postId);
        await user.save();
      }

      res.json({ message: "Добавлено в избранное", favorites: user.favorites });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Ошибка добавления в избранное" });
    }
  }

  async removeFromFavorites(req, res) {
    try {
      const userId = req.user.id;
      const { postId } = req.params;

      const user = await User.findById(userId);
      user.favorites = user.favorites.filter((id) => id.toString() !== postId);
      await user.save();

      res.json({ message: "Удалено из избранного", favorites: user.favorites });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Ошибка удаления из избранного" });
    }
  }

  async getFavorites(req, res) {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId).populate("favorites");
      if (!user) {
        return res.status(404).json({ message: "Пользователь не найден" });
      }
      res.json(user.favorites);
    } catch (e) {
      res
        .status(500)
        .json({ message: "Ошибка при получении избранных постов" });
    }
  }
  

  
  async getOnePost(req, res) {
    try {
      const id = req.params.id;
      const post = await Post.findById(id)
        .populate('comments.author', 'name')
        .populate('messages.sender', 'name')
        .populate('messages.recipient', 'name');
      if (!post) {
        return res.status(404).json({ message: "Пост не найден" });
      }
      res.json(post);
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Ошибка при получении поста" });
    }
  }

  async sendMessage(req, res) {
    try {
      const postId = req.params.id;
      const userId = req.user.id;
      const { text } = req.body;

      if (!text) {
        return res.status(400).json({ message: "Текст сообщения обязателен" });
      }

      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Пост не найден" });
      }

      const recipientId = userId === post.author ? req.body.recipientId : post.author;
      if (!recipientId) {
        return res.status(400).json({ message: "Идентификатор получателя обязателен" });
      }

      const message = {
        text,
        sender: userId,
        recipient: recipientId,
        createdAt: new Date()
      };

      post.messages.push(message);
      await post.save();

      const updatedPost = await Post.findById(postId)
        .populate('messages.sender', 'name')
        .populate('messages.recipient', 'name');
      res.status(201).json({ message: "Сообщение отправлено", post: updatedPost });
    } catch (e) {
      console.error("Ошибка при отправке сообщения:", e);
      res.status(500).json({ message: "Ошибка сервера" });
    }
  }

  async getSellerChats(req, res) {
    try {
      const userId = req.user.id;
      const posts = await Post.find({ author: userId })
        .populate('messages.sender', 'name')
        .populate('messages.recipient', 'name')
        .select('title messages');
      
      const chats = posts.reduce((acc, post) => {
        if (post.messages.length) {
          const chatUsers = [...new Set(post.messages.map(msg => msg.sender.toString()))]
            .filter(id => id !== userId);
          chatUsers.forEach(userId => {
            acc.push({
              postId: post._id,
              postTitle: post.title,
              userId,
              userName: post.messages.find(msg => msg.sender.toString() === userId)?.sender.name,
              messages: post.messages.filter(
                msg => 
                  (msg.sender.toString() === userId && msg.recipient.toString() === req.user.id) ||
                  (msg.sender.toString() === req.user.id && msg.recipient.toString() === userId)
              )
            });
          });
        }
        return acc;
      }, []);

      res.json(chats);
    } catch (e) {
      console.error("Ошибка при получении чатов:", e);
      res.status(500).json({ message: "Ошибка сервера" });
    }
  }
}

module.exports = new PostController();