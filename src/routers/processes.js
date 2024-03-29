const express = require('express')
var cookieParser = require('cookie-parser')
const {signup,
    login,
    view,
    details,
    updatebio,
    viewinterests,
    updateinterests,
    logout,
    logoutAll,
    allInterests,
    profiles,
    sendRequest,
    acceptRequest,
    allRequests,
    forgot,
    reset,
    seenProfiles,
    sendMessage,
    allChats,
    oldChats,
    updateMeta,
    deleteRequest
    } = require('../requests')

const router = new express.Router()
router.use(cookieParser())

router.get('/process/details', async (req,res)=>
{
    const token = req.cookies['JWT']
    if (token) 
    { 
        try{
            await details(token,req.query.interests,(error)=>
            {
                if(error)
                {
                    return res.send({error: "Something went wrong"})
                }
                res.send({
                })
            })
        }
        catch(error)
        {
            res.send({error:"something went wrong"})   
        }
    }
    else{    
        res.send({error:"something went wrong"})   
    }
})

router.get('/process/bio', async (req,res)=>
{
    const token = req.cookies['JWT']
    if (token) 
    { 
        try{
            await updatebio(token,req.query.bio,(error)=>
            {
                if(error)
                {
                    return res.send({error: "Something went wrong"})
                }
                res.send({
                })
            })
        }
        catch(error)
        {
            res.send({error:"something went wrong"})   
        }
    }
    else{    
        res.send({error:"something went wrong"})   
    }
})

router.get('/process/profile', async (req,res)=>
{
    const token = req.cookies['JWT']
    if (token) 
    { 
        try{
            await view(token,(error,{name,email,age,bio})=>
            {
                if(error)
                {
                    return res.send({error: "Something went wrong"})
                }
                res.send({
                    name: name,
                    email:email,
                    age,
                    bio
                })
            })
        }
        catch(error)
        {
            try
            {
                res.send({error:"something went wrong"})   
            }
            catch(e)
            {
                console.log('Something went wrong while redirecting')
            }  
        }
    }
    else{
    
        res.send({error:"something went wrong"})   
    }
})

router.get('/process/login', async (req,res)=>{
    if (!req.query.email) {
        return res.send({
            error: 'You must provide an email!'
        })
    }
    if (!req.query.password) {
        return res.send({
            error: 'You must provide a password!'
        })
    }
    try{
        await login(req.query.email,req.query.password,(error,{name,token})=>{
            if(error)
            {
                return res.send({error})
            }
            console.log(name)
            console.log(token)
            res.cookie('JWT', `${token}`, { maxAge: 24*3600000*15, httpOnly: true });
            res.send({token:"Please wait...."})
        })
    }
    catch(error)
    {
        res.send({error})
    }
})

router.get('/process/signup', async (req,res)=>{
    if (!req.query.email) {
        return res.send({
            error: 'You must provide your email!'
        })
    }
    if (!req.query.password) {
        return res.send({
            error: 'You must provide your password!'
        })
    }
    if(req.query.password != req.query.repass)
    {
        console.log(req.query.password)
        console.log(req.query.repass)
        return res.send({
            error: 'The passwords must match!'
        })
    }
    if (!req.query.age) {
        return res.send({
            error: 'You must provide your age!'
        })
    }
    if (req.query.age<13) {
        return res.send({
            error: 'You must be at least 13 years old!'
        })
    }
    if(req.query.password.toLowerCase().includes('password')){
        return res.send({error:'Your password cannot contain "password"'})
    }
    if(req.query.password.length<=7){
        return res.send({error:'Your password needs to be more than 7 characters long'})
    }
        
    try{
        await signup(req.query.email,req.query.password,req.query.name, req.query.age,(error,{name,token})=>{
            if(error)
            {
                return res.send({error})
            }
            res.send({token:"Please wait...."})
        })
    }
    catch(error)
    {
        res.send({error})
    }
})

router.get('/process/interests/you', async (req,res)=>
{
    const token = req.cookies['JWT']
    if (token) 
    { 
        try{
            await viewinterests(token,(error,{interests,owner})=>
            {
                if(error)
                {
                    return res.send({error: "Something went wrong"})
                }
                res.send({
                   interests,owner
                })
            })
        }
        catch(error)
        {
            res.send({error:"something went wrong"})   
        }
    }
    else{    
        res.send({error:"something went wrong"})   
    }
})

router.get('/process/interests', async (req,res)=>
{
    const token = req.cookies['JWT']
    if (token) 
    { 
        try{
            await updateinterests(token,req.query.interests,(error)=>
            {
                if(error)
                {
                    return res.send({error: "Something went wrong"})
                }
                res.send({
                })
            })
        }
        catch(error)
        {
            res.send({error:"something went wrong"})   
        }
    }
    else{    
        res.send({error:"something went wrong"})   
    }
})

router.get('/process/logout', async (req,res)=>
{
    const token = req.cookies['JWT']
    if (token) 
    { 
        try{
            await logout(token,(error)=>
            {
                if(error)
                {
                    res.cookie('JWT', '', { maxAge: 10, httpOnly: true });
                    return res.send({error: "Something went wrong"})
                }
                res.cookie('JWT', '', { maxAge: 10, httpOnly: true });
                res.send()
            })
        }
        catch(error)
        {
            res.cookie('JWT', '', { maxAge: 10, httpOnly: true });
            res.send({error:"something went wrong"})   
        }
    }
    else{    
        console.log("no cookie")
        res.send({error:"something went wrong"})   
    }
})

router.get('/process/logout/all', async (req,res)=>
{
    const token = req.cookies['JWT']
    if (token) 
    { 
        try{
            await logoutAll(token,(error)=>
            {
                if(error)
                {
                    res.cookie('JWT', '', { maxAge: 10, httpOnly: true });
                    return res.send({error: "Something went wrong"})
                }
                res.cookie('JWT', '', { maxAge: 10, httpOnly: true });
            })
        }
        catch(error)
        {
            res.cookie('JWT', '', { maxAge: 10, httpOnly: true });
            res.send({error:"something went wrong"})   
        }
    }
    else{    
        console.log("no cookie")
        res.send({error:"something went wrong"})   
    }
})

router.get('/process/people', async (req,res)=>
{
    const token = req.cookies['JWT']
    if (token) 
    { 
        try{
            await allInterests(token,(error,{interests,owners})=>
            {
                if(error)
                {
                    return res.send({error: "Something went wrong"})
                }
                res.send({
                   interests,
                   owners
                })
            })
        }
        catch(error)
        {
            res.send({error:"something went wrong"})   
        }
    }
    else{    
        res.send({error:"something went wrong"})   
    }
})
   
router.get('/process/people/profiles', async (req,res)=>
{
    const token = req.cookies['JWT']
    if (token) 
    { 
        try{
            await profiles(token,req.query.ids,(error,{age,bio,owner})=>
            {
                if(error)
                {
                    return res.send({error: "Something went wrong"})
                }
                res.send({ age,bio,owner })
            })
        }
        catch(error)
        {
            res.send({error:"something went wrong"})   
        }
    }
    else{    
        res.send({error:"something went wrong"})   
    }
})

router.get('/people/send', async (req,res)=>
{
    console.log("something please")
    const token = req.cookies['JWT']
    if (token) 
    { 
        try{
            console.log(req.query.id)
            await sendRequest(token,req.query.id,(error)=>
            {
                if(error)
                {
                    return res.send({error: "Something went wrong"})
                }
                res.send({
                })
            })
        }
        catch(error)
        {
            res.send({error:"something went wrong"})   
        }
    }
    else{    
        res.send({error:"something went wrong"})   
    }
})

router.get('/people/accept', async (req,res)=>
{
    const token = req.cookies['JWT']
    if (token) 
    { 
        try{
            await acceptRequest(token,req.query.id,(error)=>
            {
                if(error)
                {
                    return res.send({error: "Something went wrong"})
                }
                res.send({
                })
            })
        }
        catch(error)
        {
            res.send({error:"something went wrong"})   
        }
    }
    else{    
        res.send({error:"something went wrong"})   
    }
})

router.get('/people/delete', async (req,res)=>
{
    const token = req.cookies['JWT']
    if (token) 
    { 
        try{
            await deleteRequest(token,req.query.id,(error)=>
            {
                if(error)
                {
                    return res.send({error: "Something went wrong"})
                }
                res.send({
                })
            })
        }
        catch(error)
        {
            res.send({error:"something went wrong"})   
        }
    }
    else{    
        res.send({error:"something went wrong"})   
    }
})

router.get('/requests/all', async (req,res)=>
{
    const token = req.cookies['JWT']
    if (token) 
    { 
        try{
            await allRequests(token,(error,{ sent, rec, friends, names, position, rooms, blocked,owner, unseen, newmsgs})=>
            {
                if(error)
                {
                    return res.send({error: "Something went wrong"})
                    
                }
                res.send({
                    sent, 
                    rec,
                    friends,
                    names,
                    position, 
                    rooms, 
                    blocked,
                    owner,
                    unseen,
                    newmsgs
                })
            })
        }
        catch(error)
        {
            console.log(error)
            res.send({error:"something went wrong"})   
        }
    }
    else{    
        res.send({error:"something went wrong"})   
    }
})

router.get('/process/forgot', async (req,res)=>{
    if (!req.query.email) {
        return res.send({
            error: 'You must provide an email!'
        })
    }
    try{
        await forgot(req.query.email,(error,data)=>{
            if(error)
            {
                return res.send({error})
            }
            res.send({data:'sent successfully'})
        })
    }
    catch(error)
    {
        res.send({error})
    }
})

router.get('/process/reset', async (req,res)=>{
    if (!req.query.password) {
        return res.send({
            error: 'You must provide your password!'
        })
    }
    if(req.query.password != req.query.repass)
    {
        console.log(req.query.password)
        console.log(req.query.repass)
        return res.send({
            error: 'The passwords must match!'
        })
    }
    if(req.query.password.toLowerCase().includes('password')){
        return res.send({error:'Your password cannot contain "password"'})
    }
     
    if(req.query.password.length<=7){
        return res.send({error:'Your password needs to be more than 7 characters long'})
    }

    try{
        await reset(req.query.password,req.query.id, (error,data)=>{
            if(error)
            {
                return res.send({error})
            }
            res.send({data:'Password reset'})
        })
    }
    catch(error)
    {
        res.send({error})
    }
})

router.get('/process/seen', async (req,res)=>
{
    const token = req.cookies['JWT']
    if (token) 
    { 
        try{
            await seenProfiles(token,(error,{ids})=>
            {
                if(error)
                {
                    return res.send({error: "Something went wrong"})
                }
                res.send({
                    ids
                })
            })
        }
        catch(error)
        {
            res.send({error:"something went wrong"})   
        }
    }
    else{    
        res.send({error:"something went wrong"})   
    }
})

router.get('/message/send', async (req,res)=>
{
    const token = req.cookies['JWT']
    if (token) 
    { 
        try{
            await sendMessage(token,req.query.id,req.query.message, req.query.sender,req.query.time,(error)=>
            {
                if(error)
                {
                    return res.send({error: "Something went wrong"})
                }
                res.send({
                })
            })
        }
        catch(error)
        {
            res.send({error:"something went wrong"})   
        }
    }
    else{    
        res.send({error:"something went wrong"})   
    }
})

router.get('/chats/all', async (req,res)=>
{
    const token = req.cookies['JWT']
    if (token) 
    { 
        try{
            await allChats(token,req.query.ids,(error,data)=>
            {
                if(error)
                {
                    return res.send({error: "Something went wrong"})
                }
                res.send(data)
            })
        }
        catch(error)
        {
            res.send({error:"something went wrong"})   
        }
    }
    else{    
        res.send({error:"something went wrong"})   
    }
})

router.get('/chats/old', async (req,res)=>
{
    const token = req.cookies['JWT']
    if (token) 
    { 
        try{
            await oldChats(token,req.query.id,(error,data)=>
            {
                if(error)
                {
                    return res.send({error: "Something went wrong"})
                }
                res.send(data)
            })
        }
        catch(error)
        {
            res.send({error:"something went wrong"})   
        }
    }
    else{    
        res.send({error:"something went wrong"})   
    }
})

router.get('/update/meta', async (req,res)=>
{
    const token = req.cookies['JWT']
    if (token) 
    { 
        try{
            await updateMeta(token,req.query.room,req.query.friend,(error)=>
            {
                if(error)
                {
                    return res.send({error: "Something went wrong"})
                }
                res.send({message:"updated"})
            })
        }
        catch(error)
        {
            res.send({error:"something went wrong"})   
        }
    }
    else{    
        res.send({error:"something went wrong"})   
    }
})

module.exports=router