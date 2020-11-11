const mongoose = require('mongoose')
const ttl= require('mongoose-ttl')

const tokenSchema = new mongoose.Schema({
    tokens:[{
        token:{
            type: String,
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

tokenSchema.plugin(ttl,{ttl: 60*60000*24*30})

const Token = mongoose.model('Token', tokenSchema)


module.exports = Token