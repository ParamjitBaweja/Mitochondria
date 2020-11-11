const express = require ('express')
const User = require('../models/users')
const auth = require('../middleware/auth')
const Temp = require('../models/temp')
const Seen = require('../models/seen')
const {sendWelcomeEmail,sendCancellationEmail, verifEmail,forgotPassword} = require('../emails/account')

const router = new express.Router()

//Sign-up
router.post('/api/users', async(req,res)=>{
    const temp = new Temp(req.body) 
    try{
        const taken = await User.findOne({ email:temp.email})
        const verif = await Temp.findOne({ email:temp.email})
        if(taken){
            throw new Error({error: 'We already have a user registered with that e-mail address'})
        }
        else if(verif)
        {
            verifEmail(verif.email,verif.name,verif._id)
            res.send()
        }
        else
        {
            await temp.save()
            verifEmail(temp.email,temp.name,temp._id)
            res.send()
        }
    }catch(e){
        res.status(400).send(e)
    }
})
//Logging users in
router.post('/api/users/login', async(req,res)=>{
    try{
        const user = await User.findByCred(req.body.email,req.body.password)
        const token = await user.genAuthToken()
        res.send({user,token})
    }catch(e)
    {
        console.log(e)
        res.status(400).send(e)
    }
})

//logging out users
router.delete('/api/users/logout', auth , async(req,res)=>{
    try{
        req.tokenObject.tokens = req.tokenObject.tokens.filter((token)=>{
            return token.token!== req.token
        })
        await req.tokenObject.save()
        res.status(200).send("Logged out")
    }
    catch(e){
        console.log(e)
        res.status(500).send()
    }
})
//log out from all devices
router.delete('/api/users/logoutAll', auth , async(req,res)=>{
    try{
        req.tokenObject.tokens = []
        await req.tokenObject.save()
        res.status(200).send("Logged out")
    }
    catch(e){
        console.log(e)
        res.status(500).send()
    }
})
//View profile
router.get('/api/users/me', auth ,(req,res)=>{
    const temp = req.user.toObject()
    delete temp.password
    res.send(temp)
})


router.get('/api/verify/:id', async(req,res)=>{
    const _id= req.params.id
    try{
        const temp = await Temp.findOne({ _id})
        if(!temp)
        {
            res.status(404).send({error: 'Link expired'})
        }
        else{
            const user = new User({
                name:temp.name,
                email: temp.email,
                password:temp.password,
                age: temp.age
            })
            await user.save() 
            await temp.remove()
            const token = await user.genAuthToken()
            sendWelcomeEmail(user.email,user.name)
            res.send({user,token})
        }
    }
    catch(e)
    {
        res.status(500).send()
    }
})
//U
router.patch('/api/users/me',auth, async (req,res)=>{

    const updates = Object.keys(req.body)
    const Allowedupdates = ['name', 'email','age','password','bio']
    const isValid = updates.every((update)=>Allowedupdates.includes(update))

    if(!isValid)
    {
        res.status(400).send("invalid updates")
    }

    try{
        updates.forEach((update)=>req.user[update]=req.body[update])
        await req.user.save()
        res.send(req.user)
    }
    catch(e)
    {
        res.status(400).send(e)
    }
})
//D

// allow user to delete their own profile
router.delete('/api/users/me', auth,async (req,res)=>{

    try{
        await req.user.remove()
        sendCancellationEmail(req.user.email,req.user.name)
        res.send(req.user)
    }
    catch(e)
    {
        res.status(400).send(e)
    }
})

//Bypass email verification
router.post('/api/test/email/bypass/add/user',(req,res)=>{
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password:req.body.password,
        age:req.body.age
    })
    user.save().then(()=>{
        res.send()
    }).catch((e)=>{
        console.log(e)
        res.status(400).send({error: 'Something went wrong'})
    })
})


//forgot password
router.post('/api/forgot/password', async(req,res)=>{
    try{
        const user = await User.findOne({ email: req.body.email })
        if(!user)
        {
            return res.send()
        }
        var temp = await Temp.findOne({ email:req.body.email})
        if(temp)
        {
            forgotPassword( user.email,user.name, temp._id)
            return res.send()
        }  
        temp = new Temp({
            name:user.name,
            email: user.email,
            password: user.password,
        })
        temp = await temp.save()
        forgotPassword( user.email,user.name,temp._id) 
        res.send()
    }
    catch(e)
    {
        console.log(e)
        res.status(500).send()
    }
})

//Reset password
router.patch('/api/reset/:id', async(req,res)=>{
    const _id= req.params.id
    try{
        const temp = await Temp.findOne({ _id})
        if(!temp)
        {
            res.status(404).send({error: 'Link expired'})
        }
        else{
            const user = await User.findOne({ email: temp.email })
            user.password  = req.body.password
            await user.save() 
            await temp.remove()
            res.send()
        }
    }
    catch(e)
    {
        console.log(e)
        res.status(500).send()
    }
})

module.exports=router