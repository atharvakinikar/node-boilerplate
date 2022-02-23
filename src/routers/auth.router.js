const authRouter = require("express").Router();
const {
  register,
  login,
  getProfile,
} = require("../controller/auth.controller");
const { checkToken } = require("../middlewares/JWT");

authRouter.post("/signup", register);
authRouter.post("/login", login);
authRouter.get("/profile", checkToken, getProfile);

module.exports = authRouter;
