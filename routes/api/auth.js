const express = require('express')
const { BadRequest, Conflict, Unauthorized } = require('http-errors')
const bcrypt = require('bcryptjs')

const { User } = require('../../model/index')
const { joiRegisterShema, joiloginShema } = require('../../model/user')

const router = express.Router()

router.post('/register', async (req, res, next) => {
  try {
    const { error } = joiRegisterShema.validate(req.body)
    if (error) {
      throw new BadRequest(error.message)
    }
    const { name, email, password } = req.body
    const user = await User.findOne({ email })
    if (user) {
      throw new Conflict('User already exist')
    }
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)
    const newUser = await User.create({ name, email, password: hashPassword })
    res.status(201).json({
      user: {
        name: newUser.name,
        email: newUser.email,
      },
    })
  } catch (error) {
    next(error)
  }
})

router.post('/login', async (req, res, next) => {
  try {
    const { error } = joiloginShema.validate(req.body)
    if (error) {
      throw new BadRequest(error.message)
    }
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      throw new Unauthorized('Email or password is wrong')
    }
    const passwordCompare = await bcrypt.compare(password, user.password)
    if (!passwordCompare) {
      throw new Unauthorized('Email or password is wrong')
    }
  } catch (error) {
    next(error)
  }
})
module.exports = router
