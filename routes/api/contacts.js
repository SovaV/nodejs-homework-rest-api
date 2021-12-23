const express = require('express')
const { NotFound, BadRequest } = require('http-errors')
const { joiShema } = require('../../model/contact')
const router = express.Router()
const { Contact } = require('../../model/index')

router.get('/', async (req, res, next) => {
  try {
    res.json(await Contact.find())
  } catch (error) {
    next(error)
  }
})

router.get('/:contactId', async (req, res, next) => {
  const { contactId } = req.params
  try {
    const contacts = await Contact.findById(contactId)
    if (!contacts) {
      throw new NotFound()
    }
    res.json(contacts)
  } catch (error) {
    if (error.message.includes('Cast to ObjectId failed')) {
      error.status = 404
    }
    next(error)
  }
})
router.post('/', async (req, res, next) => {
  const body = req.body
  try {
    const { error } = joiShema.validate(body)
    if (error) {
      throw new BadRequest('missing required name field')
    }
    const newContacts = await Contact.create(body)
    res.status(201).json(newContacts)
  } catch (error) {
    if (error.message.includes('validation failed')) {
      error.status = 400
    }
    next(error)
  }
})

router.delete('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params
    const deleteContact = await Contact.findByIdAndRemove(contactId)
    if (!deleteContact) {
      throw new NotFound()
    }
    res.json({ message: 'contact deleteds' })
  } catch (error) {
    next(error)
  }
})

router.patch('/:contactId', async (req, res, next) => {
  try {
    // const { error } = joiShema.validate(req.body)
    // if (error) {
    //   throw new BadRequest('missing fields')
    // }
    const { contactId } = req.params
    const updateContactById = await Contact.findByIdAndUpdate(
      contactId,
      req.body,
      { new: true }
    )
    if (updateContactById) {
      res.json(updateContactById)
    } else {
      throw new NotFound()
    }
  } catch (error) {
    if (error.message.includes('validation failed')) {
      error.status = 400
    }
    next(error)
  }
})
router.patch('/:contactId', async (req, res, next) => {
  try {
    // const { error } = joiShema.validate(req.body)
    // if (error) {
    //   throw new BadRequest('missing fields')
    // }
    const { contactId } = req.params
    const updateContactById = await Contact.findByIdAndUpdate(
      contactId,
      req.body,
      { new: true }
    )
    if (updateContactById) {
      res.json(updateContactById)
    } else {
      throw new NotFound()
    }
  } catch (error) {
    if (error.message.includes('validation failed')) {
      error.status = 400
    }
    next(error)
  }
})
module.exports = router
