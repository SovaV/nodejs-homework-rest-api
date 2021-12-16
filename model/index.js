const fs = require('fs/promises')
const path = require('path')
const contactsPath = path.join(__dirname, './contacts.json')

const listContacts = async () => {
  const data = await fs.readFile(contactsPath)
  const result = JSON.parse(data)
  return result
}

const getContactById = async (contactId) => {
  const contacts = await listContacts()
  const getContact = contacts.find(({ id }) => id === contactId)
  return getContact
}

const removeContact = async (contactId) => {
  const products = await listContacts()
  const idx = products.findIndex((item) => item.id === contactId)
  if (idx === -1) {
    return null
  }
  const newProducts = products.filter((_, index) => index !== idx)
  await fs.writeFile(contactsPath, JSON.stringify(newProducts, null, 2))
  return products[idx]
}

const addContact = async (body) => {
  const data = await fs.readFile(contactsPath)
  const result = JSON.parse(data)
  const newContact = {
    id: String(result.length + 1),
    ...body,
  }
  const addNewContacts = result.concat(newContact)
  await fs.writeFile(contactsPath, JSON.stringify(addNewContacts, null, 2))
  return newContact
}

const updateContact = async (id, body) => {
  const contacts = await listContacts()
  const idx = contacts.findIndex((item) => item.id === id)
  if (idx === -1) {
    return null
  }
  contacts[idx] = { id, ...body }
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2))
  return contacts[idx]
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
