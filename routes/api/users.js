const express = require('express')
const { User } = require('../../model/index')
const { authenticate, upload } = require('../../middlewares')
const path = require('path')
const fs = require('fs/promises')
const Jimp = require('jimp')

const router = express.Router()

const avatarDir = path.join(__dirname, '../../', 'public', 'avatars')

router.get('/logout', authenticate, async (req, res, next) => {
  const { _id } = req.user
  await User.findByIdAndUpdate(_id, { token: null })
  res.status(204).send()
})

router.get('/current', authenticate, async (req, res, next) => {
  const { subscription, email } = req.user
  res.json({
    user: {
      email,
      subscription,
    },
  })
})

router.patch(
  '/avatars',
  authenticate,
  upload.single('avatar'),
  async (req, res, next) => {
    const { path: tmpUpload, filename } = req.file
    const [extension] = filename.split('.').reverse()
    const newFleName = `${req.user._id}.${extension}`
    const fileUpload = path.join(avatarDir, filename)
    await fs.rename(tmpUpload, fileUpload)
    const avatarURL = path.join('avatars', newFleName)

    Jimp.read(fileUpload, (err, avaJim) => {
      if (err) throw err
      avaJim
        .resize(250, 250) // resize
        .write(fileUpload) // save
    })

    await User.findByIdAndUpdate(req.user._id, { avatarURL }, { new: true })
    res.json({ avatarURL })
  }
)
module.exports = router
