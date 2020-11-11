const mongoose = require('mongoose')

const reqSchema = new mongoose.Schema({
    sent: {
        type: Array,
        default: []
    },
    rec: {
        type: Array,
        default: []
    },
    friends: {
        type: Array,
        default: []
    },
    names: {
        type: Array,
        default: []
    },
    rooms: {
        type: Array,
        default: []
    },
    position: {
        type: Array,
        default: []
    },
    unseen: {
        type: Array,
        default: []
    },
    new: {
        type: Array,
        default: []
    },
    blocked: {
        type: Array,
        default: []
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required : true,
        ref:'User'
    }
},
{
    timestamps:true
})

const Requests = mongoose.model('Requests', reqSchema)


module.exports = Requests