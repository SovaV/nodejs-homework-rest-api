const express = require("express");
const { NotFound, BadRequest } = require("http-errors");
const { User } = require("../../model/index");
const { authenticate, upload } = require("../../middlewares");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const { sendEmail } = require("../../helpers");

const { SITE_NANE } = process.env;

const router = express.Router();

const avatarDir = path.join(__dirname, "../../", "public", "avatars");

router.get("/logout", authenticate, async (req, res, next) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });
  res.status(204).send();
});

router.get("/current", authenticate, async (req, res, next) => {
  const { subscription, email } = req.user;
  res.json({
    user: {
      email,
      subscription,
    },
  });
});

router.get("/verify/:verificationToken", async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (!user) {
      throw NotFound("User not found");
    }
    await User.findByIdAndUpdate(user._id, {
      verificationToken: null,
      verify: true,
    });
    res.json({
      message: "Verification successful",
    });
  } catch (error) {
    next(error);
  }
});

router.post("/verify", async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new BadRequest("missing required field email");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw NotFound("User not found");
    }
    if (user.verify) {
      throw new BadRequest("Verification has already been passed");
    }
    const { verificationToken } = user;
    const data = {
      to: email,
      subject: "Подтверждение email",
      html: `<a target="_blank" href="${SITE_NANE}/users/verify/${verificationToken}">Подтвердить email</a>`,
    };
    await sendEmail(data);
    res.json({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
});

router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  async (req, res, next) => {
    const { path: tmpUpload, filename } = req.file;
    const [extension] = filename.split(".").reverse();
    const newFleName = `${req.user._id}.${extension}`;
    const fileUpload = path.join(avatarDir, filename);
    await fs.rename(tmpUpload, fileUpload);
    const avatarURL = path.join("avatars", newFleName);

    Jimp.read(fileUpload, (err, avaJim) => {
      if (err) throw err;
      avaJim
        .resize(250, 250) // resize
        .write(fileUpload); // save
    });

    await User.findByIdAndUpdate(req.user._id, { avatarURL }, { new: true });
    res.json({ avatarURL });
  }
);
module.exports = router;
