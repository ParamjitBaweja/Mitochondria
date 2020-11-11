const mongoose = require('mongoose')
const validator = require('validator')
//const bcrypt = require('bcryptjs')
const ttl= require('mongoose-ttl')

const tempSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        
        unique: true,
        //emails should be unique to the user
        required: true,
        trim:true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value))
            {
                throw new Error("invalid email")
            }
        }
    },
    password:
    {
        type: String,
        required: true,
        trim:true,  
        minlength: 7,
        validate(value)
        {
            if(value.toLowerCase().includes('password')){
                throw new Error('password cannot contain "password"')
            }
        }
        // this makes sure that the password is at least 7 characters long
        // and that the password doesnt contain the phrase "password"
    },
    age: {
        type: Number
    }
},
{
    timestamps:true
})



//Hash the plain text password

// tempSchema.pre('save', async function(next){

// // you cant use an arrow function here cuz arrow functions do not bind to the this keyword
// //and the pre() function uses the this keyword

//     const user = this
//     // just cuz it is simpler to understand when the word user is there
 

//     if(user.isModified('password'))
//     {
//         user.password = await bcrypt.hash(user.password,8)
//     }


//     next()
//     //since this is an asynchronous code, you need to tell the compiler that the task was completed
//     //so that the program can flow ahead. this is done by calling next()
// })

//tempSchema.index({createdAt: 1},{expireAfterSeconds: 3600})
tempSchema.plugin(ttl,{ttl: 15*60000})

const Temp = mongoose.model('Temp', tempSchema)


module.exports = Temp