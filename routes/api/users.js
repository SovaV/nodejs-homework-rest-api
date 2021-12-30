const express = require('express')
const { User } = require('../../model/index')
const { authenticate } = require('../../middlewares')

const router = express.Router()

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
