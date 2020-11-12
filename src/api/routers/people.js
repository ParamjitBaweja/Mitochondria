const express = require ('express')
const auth = require('../middleware/auth')
const Requests=require('../models/requests')
const Chats = require('../models/chats')
const mongoose = require('mongoose')

const router = new express.Router()

//list down all the requests that the user has sent or rec
router.get('/api/requests',auth, async (req,res)=>{

    try{
        const requests = await Requests.findOne({owner: req.user._id})
        if(!requests){
            res.send({sent:[],rec:[],friends:[], names:[], blocked:[], owner:req.user._id})
        }
        res.send(requests)
    }catch(e)
    {
        res.status(500).send()
    }
})
//Send a request to a user
router.post('/api/requests/send',auth, async (req,res)=>{
    const id= req.body.id
    try{
        //add it to the list of the reciever
        const recreq = await Requests.findOne({owner: id})
        if(!recreq){
            const recreq = new Requests({
                rec:[req.user._id],
                sent:[],
                friends:[],
                owner: mongoose.Types.ObjectId(id)
            })
            await recreq.save()
        }
        else{
            //if the sender is in the blocked list, they can't send a request
            var temp = recreq.blocked
            if(temp.length>0)
            {
                const index = temp.indexOf(id)
                if(index === -1)
                {
                    return res.send()
                }
            }

            recreq.rec= recreq.rec.concat(req.user._id)
            await recreq.save()
        }
        //add it to the list of the sender
        const requests = await Requests.findOne({owner: req.user._id})
        if(!requests){
            const requests = new Requests({
                rec:[],
                sent:[mongoose.Types.ObjectId(id)],
                friends:[],
                owner: req.user._id
            })
            await requests.save()
            res.send()
        }
        else{
            requests.sent= requests.sent.concat(id)
            await requests.save()
            res.send()
        }

    }catch(e)
    {
        console.log(e)
        res.status(500).send()
    }
})
//accept a request
router.post('/api/requests/accept',auth, async (req,res)=>{
    const id= req.body.id
    try{
        //create a new chat room for both of them to use
        var chats = new Chats({
            messages: [{
                message:"Say hi to a potential friend!",
                sender:"System"
            }],
            owners : [{owner: req.user._id}, {owner: mongoose.Types.ObjectId(id)}]
        })
        chats = await chats.save()
        console.log(chats)
        //move to friends list of acceptor
        const requests = await Requests.findOne({owner: req.user._id})
        if(!requests){
            res.status(404).send({error: 'Database error!'})
        }
        else{
            requests.friends= requests.friends.concat(mongoose.Types.ObjectId(id))
            var arr= requests.rec
            console.log(arr)
            if(arr.length>0)
            {
                const index = arr.indexOf(id)
                if(index>-1)
                {
                    arr.splice(index,1)
                }
            }
            requests.rec=arr
            var name = namegen(requests.names)
            requests.names = requests.names.concat(name)
            requests.rooms = requests.rooms.concat(chats._id)
            requests.position.unshift(chats._id)
            await requests.save()           
        }
        //move to the friend list of the request sender
        const recreq = await Requests.findOne({owner: id})
        if(!recreq){
            res.status(404).send({error: 'Database error!'})
        }
        else{
            recreq.friends= recreq.friends.concat(req.user._id)
            var arr= recreq.sent
            const index = arr.indexOf(req.user._id)
            if(index>-1)
            {
                arr.splice(index,1)
            }
            recreq.sent=arr
            var name = namegen(recreq.names)
            recreq.names = recreq.names.concat(name)
            recreq.rooms = recreq.rooms.concat(chats._id)
            recreq.position.unshift(chats._id)
            await recreq.save()                     
        }
        res.send()  
    }catch(e)
    {
        console.log(e)
        res.status(500).send()
    }
})
//delete a request
router.post('/api/requests/delete',auth, async (req,res)=>{
    const id= req.body.id
    try{
        //remove from sent list of acceptor
        const requests = await Requests.findOne({owner: req.user._id})
        if(!requests){
            res.status(404).send({error: 'Database error!'})
        }
        else{
            var arr= requests.rec
            console.log(arr)
            if(arr.length>0)
            {
                const index = arr.indexOf(id)
                if(index>-1)
                {
                    arr.splice(index,1)
                }
            }
            requests.rec=arr
            await requests.save()           
        }
        //move to the friend list of the request sender
        const recreq = await Requests.findOne({owner: id})
        if(!recreq){
            res.status(404).send({error: 'Database error!'})
        }
        else{
            var arr= recreq.sent
            const index = arr.indexOf(req.user._id)
            if(index>-1)
            {
                arr.splice(index,1)
            }
            recreq.sent=arr
            await recreq.save()                     
        }
        res.send()  
    }catch(e)
    {
        console.log(e)
        res.status(500).send()
    }
})



//Block a user
router.post('/api/block',auth, async (req,res)=>{
    const id= req.body.id
    try{
        //remove from friends list of user
        const requests = await Requests.findOne({owner: req.user._id})
        if(!requests){
            res.status(404).send({error: 'Database error!'})
        }
        else{
            requests.blocked= requests.blocked.concat(mongoose.Types.ObjectId(id))
            var arr= requests.friends
            var arr2 = requests.names
            var index = arr.indexOf(id)
            if(index>-1)
            {
                arr.splice(index,1)
                arr2.splice(index,1)
                requests.rooms.splice(index,1)
            }
            requests.friends=arr
            requests.names = arr2
            index = requests.position.indexOf(id)
            if(index>-1){
                requests.position.splice(index,1)
            }
            
            await requests.save()
            res.send()          
        }
    }catch(e)
    {
        res.status(500).send()
    }
})

const names = ["Dog","Cat","Mouse","Horse","Turtle","Koala","Panda","Tortoise"]
var flg =0

function namegen(arr)
{
    const ind = Math.floor
    (
        Math.random() * (names.length)
    )
    const index = arr.indexOf(`Anonymous ${names[ind]}`)
    if(flg== names.length)
    {
        return 'Anonymous'
    }
    if(index === -1)
    {
        flg=0
        return `Anonymous ${names[ind]}`
    }
    else{
        flg++
        return namegen(arr)
    }
    
}



module.exports=router