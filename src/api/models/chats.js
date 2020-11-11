const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
    messages:[{
        message:{
            type: String,
        },
        sender:{
            type: String,
        },
        time:{
            type: String
        },
        date:{
            type: String
        }
    }],
    owners:[{
        owner:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    }],
},
{
    timestamps:true
})

const Chats = mongoose.model('Chats', chatSchema)


module.exports = Chats