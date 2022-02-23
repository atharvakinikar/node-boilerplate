require("dotenv").config();
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const { generateToken } = require("../middlewares/JWT");
const nodemailer = require("nodemailer");

async function register(req, res) {
  const record = req.body;

  // checking if user already exists

  try {
    const userExist = await User.exists({ email: record.email });
    console.log(userExist);

    //process.env.Salt
    const hashedPassword = await bcrypt.hash(
      record.password,
      parseInt(process.env.SaltRounds)
    );
    const response = await User.create({
      name: record.name,
      email: record.email,
      password: hashedPassword,
      phone: record.phone,
      type: record.type,
      rules: [
        {
          houseNo: record.houseNo,
          lane: record.lane,
          city: record.city,
          pincode: record.pincode,
        },
      ],
    });

    const Token = await generateToken(response);
    res.json({
      Token,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
}

async function login(req, res) {
  const record = req.body;
  const userExist = await User.findOne({ email: record.email }).lean();

  if (!userExist) {
    return res.status(400).json({ msg: "Invalid Credentials" });
  }

  const isMatch = await bcrypt.compare(record.password, userExist.password);

  if (!isMatch) {
    return res.status(400).json({ msg: "Invalid Credentials" });
  }

  const token = await generateToken(userExist);
  res.json({
    ...userExist,
    token,
  });
}

async function getProfile(req, res) {
  const userID = req.body.userID;
  const profile = await User.findById(userID);
  if (!profile) {
    return res.status(404).send("User not found");
  }
  res.send(profile);
}

module.exports = { register, login, getProfile };
