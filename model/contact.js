const { Schema, model } = require('mongoose')
const Joi = require('joi')

const codeRegexp = /^[0-9]{9}$/

const contactSchema = Schema({
  name: {
    type: String,
    required: [true, 'Set name for contact'],
    minlength: 2,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
    require: true,
    min: 0.01,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    require: true,
    enum: ['basic', 'sale', 'stock'],
    default: 'basic',
  },
  code: {
    type: String,
    require: true,
    match: codeRegexp,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
})

const joiShema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  favorite: Joi.bool,
  status: Joi.string().valueOf('basic', 'sale', 'stock'),
  code: Joi.string().pattern(codeRegexp),
}).min(1)

const Contact = model('contact', contactSchema)

module.exports = { Contact, joiShema }
