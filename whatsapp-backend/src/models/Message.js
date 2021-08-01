const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    user : String,
    message : String,
    timestamp : String,
    recieved : Boolean
})

module.exports = mongoose.model('Message', messageSchema)