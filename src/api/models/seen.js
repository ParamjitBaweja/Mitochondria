const mongoose = require('mongoose')
const ttl= require('mongoose-ttl')

const seenSchema = new mongoose.Schema({
    ids:[{
        id:{
            type: mongoose.Schema.Types.ObjectId,
        }
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required : true,
        ref:'User'
    }
},
{
    timestamps:true
})

seenSchema.plugin(ttl,{ttl: 60*60000*24*30*2})

const Seen = mongoose.model('Seen', seenSchema)


module.exports = Seen