const express = require ('express')
const auth = require('../middleware/auth')
const Requests=require('../models/requests')
const Chats = require('../models/chats')
const mongoose = require('mongoose')

const router = new express.Router()

router.post('/api/send/message',auth, async (req,res)=>{
    const id= req.body.id
    try{
        const chats = await Chats.findOne({_id: id, 'owners.owner': req.user._id})
        if(!chats)
        {
            return res.status(404).send({error: 'Database error!'})
        }      
        chats.messages = chats.messages.concat({
            message:req.body.message,
            sender:req.body.sender,
            time:req.body.time,
            date:req.body.date,
        })
        const user1 = await Requests.findOne({owner: chats.owners[0].owner})
        const user2 = await Requests.findOne({owner: chats.owners[1].owner})
        if(!user1||!user2)
        {
            return res.status(404).send({error: 'Database error!'})
        }
        else{
            //changing the positions in both the arrays
            var index=user1.position.indexOf(id)
            if(index>-1)
            {
                user1.position.splice(index,1)
                user1.position.unshift(mongoose.Types.ObjectId(id))
            }
            var index=user2.position.indexOf(id)
            if(index>-1)
            {
                user2.position.splice(index,1)
                user2.position.unshift(mongoose.Types.ObjectId(id))
            }
            if(user1.owner.toString() === req.user._id.toString())
            {
                var index = user1.unseen.indexOf(id)
                if(index>-1)
                {
                    user1.unseen.splice(index,1)
                }
                user1.unseen.unshift(mongoose.Types.ObjectId(id))
                var index = user2.new.indexOf(id)
                if(index>-1)
                {
                    user2.new.splice(index,1)
                }
                user2.new.unshift(mongoose.Types.ObjectId(id))
            }
            else
            {
                var index = user2.unseen.indexOf(id)
                if(index>-1)
                {
                    user2.unseen.splice(index,1)
                }
                user2.unseen.unshift(mongoose.Types.ObjectId(id))
                var index = user1.new.indexOf(id)
                if(index>-1)
                {
                    user1.new.splice(index,1)
                }
                user1.new.unshift(mongoose.Types.ObjectId(id))
            }
        }
        await user1.save()
        await user2.save()
        await chats.save()       
        res.send()
    }
    catch(e){
        console.log(e)
        res.status(500).send(e)
    }

})

router.get('/api/messages/:id',auth, async (req,res)=>{
    const id= req.params.id
    try{
        const chats = await Chats.findOne({_id: id, 'owners.owner': req.user._id})
        if(!chats){
            return res.status(404).send("Couldn't find chats")
        }
        res.send(chats)
    }catch(e)
    {
        console.log(e)
        res.status(500).send()
    }
})

router.post('/api/update/meta',auth, async (req,res)=>{
    const id= req.body.room
    try{
        const user1 = await Requests.findOne({owner: req.user._id})
        const user2 = await Requests.findOne({owner: req.body.friend})
        if(!user1||!user2)
        {
            return res.status(404).send({error: 'Database error!'})
        }
        console.log(user1) 
        var index = user2.unseen.indexOf(id)
        if(index>-1)
        {
            user2.unseen.splice(index,1)
        }
        var index = user1.new.indexOf(id)
        if(index>-1)
        {
            user1.new.splice(index,1)
        }
        await user1.save()
        await user2.save()    
        res.send()
    }
    catch(e){
        console.log(e)
        res.status(500).send(e)
    }
})

//multiple chats
router.patch('/api/messages/all', auth, async (req,res)=>{
    var arr = req.body.ids.split(",")
    try{
        var records= new Array()
        records = await Chats.find({'owners.owner': req.user._id},{ messages: { $slice: -20 } }).where('_id').in(arr).exec();
        if(!records)
        {
            return res.status(500).send("Database error")
        }
        res.send(records)
    }
    catch(e)
    {
        console.log(e)
        res.status(400).send({error: 'Something went wrong'})
    }
})

module.exports=router