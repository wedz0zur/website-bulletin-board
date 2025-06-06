const User = require("../models/User")
const Post = require("../models/Post");
const Role = require("../models/UserRole");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const { secret } = require("../config");
const mailer = require("../nodemailer");

const generateAccessToken = (id, roles) => {
  const payload = {
    id,
    roles,
  };
  return jwt.sign(payload, secret, { expiresIn: "24h" });
};

class authController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: "Ошибка при регистрации", errors });
      }
      const { name, userlogin, email, password } = req.body;
      const candidate = await User.findOne({ userlogin });
      if (candidate) {
        return res
          .status(400)
          .json({ message: "Пользователь с таким логином уже существует" });
      }

      const emailCandidate = await User.findOne({ email });
      if (emailCandidate) {
        return res
          .status(400)
          .json({ message: "Пользователь с таким email уже существует" });
      }
      const hashPassword = bcrypt.hashSync(password, 8);
      const userRole = await Role.findOne({ value: "USER" });
      if (!userRole) {
        return res
          .status(500)
          .json({ message: "Роль USER не найдена в системе" });
      }

      const user = new User({
        name,
        userlogin,
        email,
        password: hashPassword,
        roles: [userRole.value],
      });
      if (req.file) {
        console.log(req.file);
        user.avatar = req.file.path;
      }

      await user.save();

      const message = {
        to: req.body.email,
        subject: "Подтверждение электронной почты",
        text: `Поздравляем вы успешно зарегистрировались на нашем сайте
        данные вашей учетной записи
        login:${req.body.userlogin} , 
        password: ${req.body.password}`,
      };
      mailer(message);

      return res.status(200).json("Регистрация прошла успешно");
    } catch (e) {
      console.error("Ошибка при регистрации:", e);
      res.status(400).json({ message: "Ошибка регистрации", error: e.message });
    }
  }

  async login(req, res) {
    try {
      const { userlogin, password } = req.body;
      const user = await User.findOne({ userlogin });
      if (!user) {
        return res
          .status(400)
          .json({ message: "Неправильный логин или пароль, повторите вход!" });
      }
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return res
          .status(400)
          .json({ message: "Введен неверный логин или пароль" });
      }
      const token = generateAccessToken(user._id, user.roles);

      return res.status(200).json({ token: token });
    } catch (e) {}
  }

  async getUsers(req, res) {
    try {
      const userRole = new Role();
      const adminRole = new Role({ value: "ADMIN" });
      await userRole.save();
      await adminRole.save();

      const users = await User.find();
      res.json(users);
    } catch (e) {
      console.log(e);
    }
  }

  async getMe(req, res) {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return res
          .status(404)
          .json({ message: "Ошибка при получение данных " });
      }

      const postCount = await Post.countDocuments({ author: user._id });

      const { password, ...userData } = user._doc;

      res.json({ ...userData, postCount });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "Ошибка при получении данных пользователя" });
    }
  }

  async updateUser(req, res) {
    try {
      const id = req.user.id;
      const { name, userlogin, email } = req.body;
  
      const user = await User.findByIdAndUpdate(
        id,
        { name, userlogin, email },
        { new: true }
      );
  
      if (!user) {
        return res.status(404).json({ message: "Пользователь не найден" });
      }
  
      res.status(200).json({ message: "Профиль успешно обновлён", user });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Ошибка сервера" });
    }
  }
  
}

module.exports = new authController();
