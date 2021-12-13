const express = require('express')
const router = express.Router()
const { listContacts, getContactById } = require('../../model/index')

router.get('/', async (req, res, next) => {
  const getListContacts = await listContacts()
  res.json({ getListContacts })
})

router.get('/:contactId', async (req, res, next) => {
  const getById = await getContactById()
  res.send(`${getById} ${req.params.contactId}`)
})

router.post('/', async (req, res, next) => {
  // res.json({ message: 'template message2' })
  // if (!req.body.goit) {
  //   return res.status(400).json({ status: 'error' })
  // }
  res.json({ message: 'object', body: req.body })
})

router.delete('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message3' })
})

router.patch('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message4' })
})

module.exports = router
