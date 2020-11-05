const express = require('express')
const path = require('path')
const hbs = require('hbs')
var cookieParser = require('cookie-parser')
const processes = require('./routers/processes')
const main = require('./routers/main')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')
const {generateMessage,generateLocationMessage}=require('./utils/messages')
const {addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users')


///paths
const publicpath=path.join(__dirname, '../public')
const viewpath=path.join(__dirname,'../Temp/View')
const partialpath=path.join(__dirname,'../Temp/Partial')

const app = express()
const server = http.createServer(app)
const io = socketio(server)
const port=process.env.PORT||3000

//set up handle bars for express
app.set('view engine', 'hbs')
app.set('views', viewpath)
hbs.registerPartials(partialpath)

app.use(express.static(publicpath))
app.use(cookieParser())

app.use(processes)
app.use(main)

io.on('connection',(socket)=>{

    socket.on('join',({username,room}, callback)=>{         
        socket.join([room,username])
        callback()
    })
    socket.on('typing',({room,mode})=>{  
        socket.broadcast.to(room).emit('typing', mode)        
    })
    socket.on('newmessage',({notif,room})=>{  
        socket.broadcast.to(room).emit('newmessage', notif)        
    })
    socket.on('sendMessage',({room,username,message},callback)=>{       
        const filter= new Filter()

        if(filter.isProfane(message)){
            return callback('Please refrain from profanity')
        }
        io.to(room).emit('message', generateMessage(username,message))
        callback()
    })
    socket.on('exit',({username,room})=>{
        socket.leave(room)
    })
})

server.listen(port,()=>{
    console.log('server is up on port'+port)
})

// io.on('connection',(socket)=>{
//     console.log('new websocket connection')

//     //join deals with a specific room
//     socket.on('join',({username,room}, callback)=>{
        
//         const {error,user}=addUser({id: socket.id, username, room})
        
//         if(error){
//             return callback(error)
//         }

//         socket.join(user.room)

//         callback()
//         //acknowldeges that there was no error
//     })

//     socket.on('sendMessage',(msg,callback)=>{
        
//         const user=getUser(socket.id)
//         if(user==undefined)
//         {
//             return callback('refresh')
//         }
//         const filter= new Filter()

//         if(filter.isProfane(msg)){
//             return callback('Profanity is not allowed!')
//         }
    
//         io.to(user.room).emit('message', generateMessage(user.username,msg))

//         callback()
//     })
//     //accepts what one client sends
//     //and sends it across to all the other clients


//     socket.on('typing',(mode)=>{
        
//         const user=getUser(socket.id)
//         if(user!=undefined)
//         {
//             socket.broadcast.to(user.room).emit('typing', mode)
//         }   
        
//     })

//     socket.on('exit',({username,room})=>{
//         socket.leave(room)
//         const user = removeUser(socket.id)
//     })

//     socket.on('disconnect',()=>{
//         const user = removeUser(socket.id)
//     })
//     //sends a message to all connected clients that 
//     //one client has diconnected
// })



