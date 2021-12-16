const express = require('express')
const { NotFound, BadRequest } = require('http-errors')
const Joi = require('joi')
const router = express.Router()
const {
  listContacts,
  getContactById,
  addContact,
  updateContact,
  removeContact,
} = require('../../model/index')

const joiShema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
}).min(1)

router.get('/', async (req, res, next) => {
  try {
    res.json(await listContacts())
  } catch (error) {
    next(error)
  }
})

router.get('/:contactId', async (req, res, next) => {
  const { contactId } = req.params
  try {
    const contacts = await getContactById(contactId)
    if (!contacts) {
      throw new NotFound()
    }
    res.json(contacts)
  } catch (error) {
    next(error)
  }
})
router.post('/', async (req, res, next) => {
  const body = req.body
  try {
    const { error } = joiShema.validate(body)
    if (error) {
      throw new BadRequest(error.message)
    }
    const contacts = await addContact(body)
    res.status(201).json(contacts)
    console.log(req.body)
  } catch (error) {
    next(error)
  }
})

router.delete('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params
    const deleteContact = await removeContact(contactId)
    if (!deleteContact) {
      throw new NotFound()
    }
    res.json({ message: 'product delete' })
  } catch (error) {
    next(error)
  }
})

router.patch('/:contactId', async (req, res, next) => {
  try {
    const { error } = joiShema.validate(req.body)
    if (error) {
      throw new BadRequest(error.message)
    }
    const { contactId } = req.params
    const updateContactById = await updateContact(contactId, req.body)
    if (!updateContactById) {
      throw new NotFound()
    }
    res.json(updateContactById)
  } catch (error) {
    next(error)
  }
})

module.exports = router
