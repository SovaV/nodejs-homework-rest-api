const express = require('express')
const { NotFound, BadRequest } = require('http-errors')
const { authenticate } = require('../../middlewares')
const { joiShema } = require('../../model/contact')
const router = express.Router()
const { Contact } = require('../../model/index')
//
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { page = 1, limit = 20, favorite } = req.query
    const skip = (page - 1) * limit
    const { _id } = req.user
    if (favorite) {
      res.json(await Contact.find({ owner: _id, favorite }))
    } else {
      res.json(
        await Contact.find({ owner: _id }, '-owner -__v', {
          skip,
          limit: +limit,
          favorite,
        })
      )
    }
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
router.post('/', authenticate, async (req, res, next) => {
  const body = req.body
  try {
    const { error } = joiShema.validate(body)
    if (error) {
      throw new BadRequest('missing required name field')
    }
    const { _id } = req.user
    const newContacts = await Contact.create({ ...body, owner: _id })
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

router.put('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params
    const updateContactById = await Contact.findByIdAndUpdate(
      contactId,
      req.body,
      { new: true }
    )
    if (!updateContactById) {
      throw new NotFound()
    }
    res.json(updateContactById)
  } catch (error) {
    if (error.message.includes('validation failed')) {
      error.status = 400
    }
    next(error)
  }
})
router.patch('/:contactId/favorite', async (req, res, next) => {
  try {
    const { contactId } = req.params
    const { favorite } = req.body
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: 'missing field favorite',
      })
    }
    const updateContactById = await Contact.findByIdAndUpdate(
      contactId,
      { favorite },
      { new: true }
    )
    if (!updateContactById) {
      throw new NotFound()
    }
    res.json(updateContactById)
  } catch (error) {
    next(error)
  }
})
module.exports = router
