const express = require ('express')
const Task = require('../models/tasks')
const User = require('../models/users')
const auth = require('../middleware/auth')
const Seen = require('../models/seen')

const router = new express.Router()
//Create list of interests
router.post('/api/interests',auth,(req,res)=>{
    var arr = req.body.interests.split(",")
    const task = new Task({
        interests: arr,
        owner: req.user._id
    })
    task.save().then(()=>{
        res.status(201).send(task)
    }).catch((e)=>{
        res.status(400).send({error: 'Something went wrong'})
    })
})
//multiple user profiles
router.patch('/api/profiles', auth, async (req,res)=>{
    var arr = req.body.ids.split(",")
    try{
        var records= new Array()
        records = await User.find().where('_id').in(arr).exec();
            const seen = await Seen.findOne({owner: req.user._id})
            if(!seen)
            {
                const temptok = new Seen({owner:req.user._id})
                for(i=0;i<arr.length;i++)
                {
                    temptok.ids = temptok.ids.concat({id:arr[i]})
                }
                await temptok.save()
            }
            else
            {
                for(i=0;i<arr.length;i++)
                {
                    seen.ids = seen.ids.concat({id:arr[i]})
                }
                await seen.save()
            }
        
        temp = new Array()
        temp = records
        for(i=0;i<temp.length;i++)
        {
            const obj = temp[i].toObject()
            delete obj.password
            delete obj.email
            delete obj.name
            delete obj.createdAt
            delete obj.updatedAt
            temp[i]=obj
        }
        res.send(temp)
    }
    catch(e)
    {
        console.log(e)
        res.status(400).send({error: 'Something went wrong'})
    }
})

//pull the list of interests 
router.get('/api/interests', auth, function(req, res) 
{
    Task.find({}, function(err, tasks) 
    {
        if(err)
        {
            return res.status(500).send()
        }
        var interests = new Array();
        var owners= new Array();
        tasks.forEach(function(task) 
        {
            if(req.user._id!==task.owner)
            {
                interests.push(task.interests);
                owners.push(task.owner)
            }
        });
        res.send({
          interests,
          owners
        })
    });
});
//list down the particular user's intersts
router.get('/api/interests/me',auth, async (req,res)=>{

    try{
        const task = await Task.findOne({owner: req.user._id})
        if(!task){
            res.status(404).send()
        }
        res.send(task)
    }catch(e)
    {
        res.status(500).send()
    }
})

//Update interests

router.patch('/api/interests/',auth,async (req,res)=>{

    const updates = Object.keys(req.body)
    const Allowedupdates = ['interests']
    const isValid = updates.every((update)=>Allowedupdates.includes(update))
    if(!isValid)
    {
        res.status(400).send("invalid updates")
    }

    try{
        const task = await Task.findOne({owner: req.user._id})
        if(!task)
        {
            res.status(404).send()
        }
        var arr = req.body.interests.split(",")
        // const temp = new Task({
        //     interests: arr,
        //     owner: req.user._id
        // })
        task.interests=arr
        
        await task.save()
        res.send(task)
    }
    catch(e)
    {
        res.status(400).send(e)
    }
})

//seen profiles
router.get('/api/seen', auth, async (req, res) =>
{
    try{
        const seen = await Seen.findOne({owner: req.user._id})
        if(!seen){
            res.status(404).send()
        }
        var ids=new Array()
        for(i=0;i<seen.ids.length;i++)
        {
            ids.push(seen.ids[i].id)
        }
        res.send(ids)
    }catch(e)
    {
        res.status(500).send()
    }
});

module.exports=router