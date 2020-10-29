const express = require('express')
var cookieParser = require('cookie-parser')
const axios = require('axios')

const router = new express.Router()

router.use(cookieParser())

// router.get('',(req,res)=>{
//     //res.redirect('/profile')
//     res.render('chat')
// }) 
router.get('/login',(req,res)=>{
    res.render('login',{
        title:'Login',
    })
})  


router.get('/profile',(req,res)=>{
    res.render('view',{
        title:'Your Profile',
    })
}) 

router.get('/signup',(req,res)=>{
    res.render('signup',{
        title:'Sign Up',
    })
}) 
router.get('/interests',(req,res)=>{
    res.render('interests',{
        title:'Choose your Interests',
    })
})
router.get('/interests/you',(req,res)=>{
    res.render('yourinterests',{
        title:'Your interests',
    })
})
router.get('/bio',(req,res)=>{
    res.render('bio',{
        title:'Update your bio',
    })
})
router.get('/details',(req,res)=>{
    res.render('details',{
        title:'Choose your Interests',
    })
})
router.get('/people',(req,res)=>{
    res.render('people',{
        title:'People',
    })
})
router.get('/verify/:id', async(req,res)=>{
    const _id= req.params.id
    try {
        const response = await axios.get(`https://mitochondria-api.herokurouter.com/verify/${req.params.id}`)
        res.cookie('JWT', `${response.data.token}`, { maxAge: 24*3600000*15, httpOnly: true });
        res.render('welcome',{
            title:'Welcome',
        })
      }
      catch(error)
      {
        console.log(error)
        res.render('veriffail',{
            title:'Link expired',
        })
      }
})
router.get('/help',(req,res)=>{
    res.send({
        error: 'page down for maintenance'
    })
})
router.get('/help/*',(req,res)=>{
    res.send('help article not found')
})

router.get('/about',(req,res)=>{
    res.send('help article not found')
})

router.get('*',(req,res)=>{
    res.send("404")
})

module.exports= router