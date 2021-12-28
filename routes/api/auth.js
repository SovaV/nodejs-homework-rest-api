const express = require('express')
const { BadRequest } = require('http-errors')

const { User } = require('../../model/index')
const { joiShema } = require('../../model/user')

const router = express.Router()

router.post('/register', async (req, res, next) => {
  try {
    const { error } = joiShema.validate(req.body)
    if (error) {
      throw new BadRequest('error.message')
    }
  } catch (error) {
    next(error)
  }
})

module.exports = router
