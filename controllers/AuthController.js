const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");
const APIError = require("../helpers/APIError");
const bcrypt = require("bcryptjs");

const config = require("../config/index");
const User = require("../models/User");

exports.login = async (req, res, next) => {
  try {
    let errors = [];

    if (!req.body.email) {
      errors.push({ error_msg: "Email can't be empty!" });
    }
    if (!req.body.password) {
      errors.push({ error_msg: "Password can't be empty!" });
    }

    if (errors.length > 0) {
      const err = new APIError(
        errors[0].error_msg,
        httpStatus.UNPROCESSABLE_ENTITY,
        true
      );
      return next(err);
    }

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      // User not found
      throw new Error("User not registered!");
    }

    const hassPassword = user.password;

    if (bcrypt.compareSync(req.body.password, hassPassword)) {
      console.log("Login successful.");
      const token = jwt.sign(
        {
          email: user.email,
        },
        config.jwtSecret,
        {
          expiresIn: config.jwtExpiresIn,
        }
      );
      return res.json({
        token,
        email: user.email,
      });
    } else {
      // Password not matched
      throw new Error("Password not matched!");
    }
  } catch (error) {
    const statusCode =
      error.message === "User not registered!"
        ? httpStatus.NOT_FOUND
        : httpStatus.UNAUTHORIZED;

    const apiError = new APIError(error.message, statusCode, true);
    return next(apiError);
  }
};

exports.logout = (req, res) => {
  req.logout();
};
