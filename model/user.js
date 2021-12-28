const { Schema, model } = require('mongoose')
const Joi = require('joi')

const emailRegexp = /^\w+([\.-]?\w+)+@\w+([\.:]?\w+)+(\.[a-zA-Z0-9]{2,3})+$/

const userSchema = Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      match: emailRegexp,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      minlength: 6,
      require: true,
    },
  },
  { versionKey: false, timestamps: true }
)

const joiShema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().pattern(emailRegexp).required(),
  phone: Joi.string().min(6).required(),
})

const User = model('user', userSchema)

module.exports = { User, joiShema }
