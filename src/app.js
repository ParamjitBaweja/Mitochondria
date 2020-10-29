const express = require('express')
const path = require('path')
const hbs = require('hbs')
var cookieParser = require('cookie-parser')
const processes = require('./routers/processes')
const main = require('./routers/main')
const people = require('./routers/people')
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
app.use(people)



io.on('connection',(socket)=>{
    console.log('new websocket connection')

    //join deals with a specific room
    socket.on('join',({username,room}, callback)=>{
        
        const {error,user}=addUser({id: socket.id, username, room})
        
        if(error){
            return callback(error)
        }

        socket.join(user.room)
        socket.emit('message',generateMessage('System','Welcome'))
        //sends a welcome message to a user that joins

        socket.broadcast.to(user.room).emit('message',generateMessage('System',`${user.username} has joined`))
        //sends a message to all clients, except the new client,
        //that a new client has joined

        io.to(user.room).emit('roomData',{
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback()
        //acknowldeges that there was no error
    })

    socket.on('sendMessage',(msg,callback)=>{
        
        const user=getUser(socket.id)
        
        const filter= new Filter()

        if(filter.isProfane(msg)){
            return callback('Profanity is not allowed!')
        }

        io.to(user.room).emit('message', generateMessage(user.username,msg))

        callback()
    })
    //accepts what one client sends
    //and sends it across to all the other clients

    socket.on('disconnect',()=>{
        const user = removeUser(socket.id)
        if(user)
        {
            io.to(user.room).emit('message',generateMessage('System',`${user.username} has left`))
            io.to(user.room).emit('roomData',{
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
    //sends a message to all connected clients that 
    //one client has diconnected
    socket.on('sendLocation',(coords,callback)=>{
        const user=getUser(socket.id)
        io.to(user.room).emit('locationMessage',generateLocationMessage(user.username,`http://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })
    //shares the location as sent by the client, to all the clients
    //including the client that sent it
})



server.listen(port,()=>{
    console.log('server is up on port'+port)
})