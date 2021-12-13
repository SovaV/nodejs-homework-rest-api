const fs = require('fs/promises')
const path = require('path')
const contacts = path.join(__dirname, './contacts.json')

// const contacts = require('./contacts.json')

const listContacts = async () => {
  try {
    const data = await fs.readFile(contacts, 'utf8')
    const result = JSON.parse(data)
    return result
  } catch (error) {
    console.error(error)
  }
}

const getContactById = async (contactId) => {
  try {
    const data = await fs.readFile(contacts, 'utf8')
    const contactsId = JSON.parse(data)
    const getContact = contactsId.filter(({ id }) => id === contactId)
    return getContact
  } catch (error) {
    console.error(error)
  }
}

const removeContact = async (contactId) => {}

const addContact = async (body) => {}

const updateContact = async (contactId, body) => {}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
