const jwt = require("jsonwebtoken");
const { secret } = require("../config");

module.exports = function (req, res, next) {
  if (req.method === "OPTIONS") {
    return next(); 
  }

  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(403).json({ message: "Требуется авторизация" });
    }

    const token = authHeader.split(' ')[1]; 
    
    if (!token) {
      return res.status(403).json({ message: "Неверный формат токена" });
    }

    const decodedData = jwt.verify(token, secret);
    req.user = decodedData; 
    next();
    
  } catch (e) {
    console.error("JWT verification error:", e.message); е
    
    if (e instanceof jwt.TokenExpiredError) {
      return res.status(403).json({ message: "Токен истёк" });
    }
    
    if (e instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({ message: "Недействительный токен" });
    }
    
    return res.status(403).json({ message: "Ошибка авторизации" });
  }
};