const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken', {expiresIn:'15 days'})
const Task = require('./tasks')
const Token = require('./tokens')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        trim: true,
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
    },
    bio:{
        type: String,
        trim: true,
        default: "Bio not updated"
    }
},
{
    timestamps:true
})

//virtual property for task relationship
userSchema.virtual('tasks',{
    ref: 'Task',
    localField : '_id',
    foreignField : 'owner'
})
userSchema.virtual('tokens',{
    ref: 'Token',
    localField : '_id',
    foreignField : 'owner'
})
userSchema.virtual('seen',{
    ref: 'Seen',
    localField : '_id',
    foreignField : 'owner'
})

// Hash the plain text password

userSchema.pre('save', async function(next){

// you cant use an arrow function here cuz arrow functions do not bind to the this keyword
//and the pre() function uses the this keyword

    const user = this
    // just cuz it is simpler to understand when the word user is there
 

    if(user.isModified('password'))
    {
        user.password = await bcrypt.hash(user.password,8)
    }


    next()
    //since this is an asynchronous code, you need to tell the compiler that the task was completed
    //so that the program can flow ahead. this is done by calling next()
})

//checks login credentials
userSchema.statics.findByCred = async(email,password)=>{
  
    const user = await User.findOne({ email })
    // shorthand for email:email

    if(!user)
    {
        throw new Error('Unable to login')
    }
   
    const isMatch = await bcrypt.compare(password,user.password)
 
    if(!isMatch)
    {
        throw new Error('Unable to login')
    }
    return user
}


//generate authentication token
//unlike statics which are model functions, methods are instance functions
userSchema.methods.genAuthToken = async function()
{
    const user = this
    const tok = await Token.findOne({owner: user._id})
    const token = jwt.sign({_id: user._id.toString()},process.env.JWT_SECRET)
    if(!tok)
    {
        const temptok = new Token({owner:user._id})
        temptok.tokens = temptok.tokens.concat({token})
        await temptok.save()
    }
    else
    {
        tok.tokens = tok.tokens.concat({token})
        await tok.save()
    }

    return token
}


 

// delete tasks when the user is deleted
userSchema.pre('remove', async function(next){
    const user = this
    await Task.deleteMany({owner: user._id})
    next()
})

const User = mongoose.model('User', userSchema )

module.exports = User