const express = require('express')
const router = express.Router()
const { listContacts, getContactById } = require('../../model/index')
const product = require('../../model/contacts.json')
router.get('/', async (req, res, next) => {
  // const getListContacts = await listContacts()
  // res.json(await listContacts())
  res.json(product)
})

router.get('/:contactId', async (req, res, next) => {
  // const getById = await getContactById()
  // res.send(`${getById} ${req.params.contactId}`)
  const { id } = req.params
  const result = product.find((item) => item.id === id)
  res.json(result)

  // res.json(await getContactById())
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
