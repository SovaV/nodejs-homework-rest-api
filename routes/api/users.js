const express = require('express')
const { User } = require('../../model/index')
const { authenticate } = require('../../middlewares')

const router = express.Router()

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

module.exports = router