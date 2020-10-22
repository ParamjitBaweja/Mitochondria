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
    profiles
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
    if(req.query.password.toLowerCase().includes('password')){
        return res.send({error:'Your password cannot contain "password"'})
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


module.exports=router