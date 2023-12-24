const jwt = require("jsonwebtoken");

const jwtSecretKey = process.env.JWT_SECRET_KEY || "Ib9747aeuaZovBEtWJKuHe"; // Use a default key if not provided

const config = {
  env: process.env.NODE_ENV,
  port: process.env.PORT || 9000,
  jwtExpiresIn: 86400,
  jwtSecret: jwtSecretKey,
  jwtMiddleware: (req, res, next) => {
    // Your custom authentication logic using jsonwebtoken
    // For example, check the presence and validity of JWT in the request
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.decode(token);
    console.log("Decoded Token:", decoded);

    try {
      const decoded = jwt.verify(token, jwtSecretKey);
      req.user = decoded;
      next();
    } catch (error) {
      // console.log(error);
      return res.status(401).json({ message: "Invalid token" });
    }
  },
};

if (process.env.NODE_ENV === "production") {
  console.log("production");
  config.mongoUri =
    "mongodb+srv://var434:OIHi239@cluster0.8oaycts.mongodb.net/?retryWrites=true&w=majority";
} else {
  console.log("DEV");
  // config.mongoUri = "mongodb://localhost/shopping-cart-api";
  config.mongoUri =
    "mongodb+srv://var434:OIHi239@cluster0.8oaycts.mongodb.net/?retryWrites=true&w=majority";
}

module.exports = config;
