const express = require('express')
const path = require('path')
const hbs = require('hbs')
var cookieParser = require('cookie-parser')
const processes = require('./routers/processes')
const axios = require('axios')


///paths
const publicpath=path.join(__dirname, '../public')
const viewpath=path.join(__dirname,'../Temp/View')
const partialpath=path.join(__dirname,'../Temp/Partial')

const app = express()
const port=process.env.PORT||3000

//set up handle bars for express
app.set('view engine', 'hbs')
app.set('views', viewpath)
hbs.registerPartials(partialpath)

app.use(express.static(publicpath))
app.use(cookieParser())

app.use(processes)
app.get('',(req,res)=>{
    res.redirect('/profile')
}) 
app.get('/login',(req,res)=>{
    res.render('login',{
        title:'Login',
    })
})  
app.get('/profile',(req,res)=>{
    res.render('view',{
        title:'Your Profile',
    })
}) 
app.get('/signup',(req,res)=>{
    res.render('signup',{
        title:'Sign Up',
    })
}) 
app.get('/interests',(req,res)=>{
    res.render('interests',{
        title:'Choose your Interests',
    })
})
app.get('/interests/you',(req,res)=>{
    res.render('yourinterests',{
        title:'Your interests',
    })
})
app.get('/bio',(req,res)=>{
    res.render('bio',{
        title:'Update your bio',
    })
})
app.get('/details',(req,res)=>{
    res.render('details',{
        title:'Choose your Interests',
    })
})
app.get('/people',(req,res)=>{
    res.render('people',{
        title:'People',
    })
})
app.get('/verify/:id', async(req,res)=>{
    const _id= req.params.id
    try {
        const response = await axios.get(`https://mitochondria-api.herokuapp.com/verify/${req.params.id}`)
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
app.get('/help',(req,res)=>{
    res.send({
        error: 'page down for maintenance'
    })
})
app.get('/help/*',(req,res)=>{
    res.send('help article not found')
})

app.get('/about',(req,res)=>{
    res.send('help article not found')
})

app.get('*',(req,res)=>{
    res.send("404")
})
app.listen(port,()=>{
    console.log('server is up on port'+port)
})