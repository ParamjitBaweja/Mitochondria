const express = require('express')
var cookieParser = require('cookie-parser')
const {
    sendRequest
    } = require('../requests')

const router = new express.Router()
router.use(cookieParser())

router.get('/profile',(req,res)=>{
    res.render('view',{
        title:'Your Profile',
    })
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



module.exports=router