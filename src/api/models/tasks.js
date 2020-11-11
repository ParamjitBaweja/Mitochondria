const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    interests: {
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

const Task = mongoose.model('Task', taskSchema)


module.exports = Task