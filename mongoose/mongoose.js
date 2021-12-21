const mongoose = require('mongoos')
const DB_HOST =
  'mongodb+srv://vova:123123qwe@cluster0.wx8wq.mongodb.net/db-contacts?retryWrites=true&w=majority'
mongoose
  .connect(DB_HOST)
  .then(() => {
    console.log('Database connection successful')
  })
  .catch((error) => {
    console.log(error.message)
    process.exit(1)
  })
