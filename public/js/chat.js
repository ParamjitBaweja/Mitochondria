const socket = io()

//Elements
const messageForm = document.querySelector('#messageData')
const messageZero = document.querySelector('#messageZero')
const formInput = messageForm.querySelector('input')
const formButton = messageForm.querySelector('button')
const sendLocationButton = document.querySelector('#send-location')
const messages = document.querySelector('#messages')

//Templates
const messageTemplate= document.querySelector('#message-template').innerHTML
const locationMessageTemplate= document.querySelector('#locationMessage-template').innerHTML
const sidebarTemplate= document.querySelector('#sidebar-template').innerHTML
const sidebarTemplateNew= document.querySelector('#sidebar-template-new').innerHTML
const showMoreButton = document.querySelector('#showMore').innerHTML


//variables
var friends = new Array()
var names = new Array()
var rooms = new Array()
var position = new Array()
var me=''
var current=''
var unseen = new Array()
var newmsgs = new Array()
var allmsgs = new Array()
var oldchats = new Array()
messageZero.textContent = "Loading..."

document.getElementById("findpeople").onclick = function () {
    console.log("clicked")
    window.location.pathname = "/people";
};


//render contacts in the sidebar
fetch('/requests/all').then((response)=>{
    response.json().then((data) => {
        if(data.error)
        {
            return window.location.pathname = '/login'
        }
        friends = data.friends
        names = data.names
        rooms= data.rooms
        position=data.position
        me=data.owner 
        unseen = data.unseen
        newmsgs  = data.newmsgs
        console.log(friends.length)
        if(friends.length==0)
        {
            messageZero.textContent = "You have no chats. Please find people to proceed."
            document.getElementById("findpeople").style.display='block'        
        }
        else{
            if(rooms===undefined)
            {
                return window.location.pathname = '/profile'
            }
            socket.emit('join',{username:me,room:me}, (error)=>{
                if(error)
                {
                    alert(error)
                    location.href='/'
                }
            })             
            if(rooms.length>0)
            {
                var x= rooms.toString()
                fetch('/chats/all?ids='+x).then((response)=>{
                    response.json().then((data) => {
                        if (data.error) {
                            messageOne.textContent = data.error
                            window.location.pathname = '/login'
                        } else {
                            allmsgs= data
                            sidebarRender()
                        }
                    })
                })
            }
            else{
                sidebarRender()
            }
        }
    })
})

function sidebarRender()
{
    document.querySelector('#sidebar').innerHTML = '<p id="messageZero"></p><button id="findpeople" >Find People</button>'
    if(friends.length==0)
    {
        messageZero.textContent = "You have no chats. Please find people to proceed."
        document.getElementById("findpeople").style.display='block'        
    }
    else{
    messageZero.textContent = ""
    }
    for(i=0; i < position.length;i++)
    {
        const newindex= newmsgs.indexOf(position[i])
        const index = rooms.indexOf(position[i])
        var html=''
        if(newindex>-1)
        {
            html = Mustache.render(sidebarTemplateNew,{
                friendname: names[index]
            })
        }
        else{
            html = Mustache.render(sidebarTemplate,{
                friendname: names[index]
            })
        }
        //console.log(names[index])
        document.querySelector('#sidebar').insertAdjacentHTML('beforeend',html)
    }
}

function messagesRender(index)
{
    for(i=0;i<allmsgs.length;i++)
    {
        if(rooms[index]===allmsgs[i]._id)
        {
            if(allmsgs[i].messages[0].sender!=="System")
            {
                const html = Mustache.render(showMoreButton)
                messages.insertAdjacentHTML('beforeend',html)
                //autoscroll()
                messages.scrollTop = messages.scrollHeight
            }
            for(j=0;j<allmsgs[i].messages.length;j++)
            {
                if(allmsgs[i].messages[j].sender===me)
                {
                    const html = Mustache.render(locationMessageTemplate,{
                        message: allmsgs[i].messages[j].message,
                        createdAt: moment(allmsgs[i].messages[j].time).format('h:mm a')
                    })
                    messages.insertAdjacentHTML('beforeend',html)
                    //autoscroll()
                    messages.scrollTop = messages.scrollHeight
                }
                else if(allmsgs[i].messages[j].sender==='System')
                {
                    const html = Mustache.render(messageTemplate,{
                        message: "Hello",
                        //createdAt: "System"
                    })
                    messages.insertAdjacentHTML('beforeend',html)
                    //autoscroll()
                    messages.scrollTop = messages.scrollHeight
                }
                else{
                    const html = Mustache.render(messageTemplate,{
                        message: allmsgs[i].messages[j].message,
                        createdAt: moment(allmsgs[i].messages[j].time).format('h:mm a')
                    })
                    messages.insertAdjacentHTML('beforeend',html)
                    //autoscroll()
                    messages.scrollTop = messages.scrollHeight
                }
            }
        }
    }
    const searchind = newmsgs.indexOf(rooms[index])
    if(searchind >-1)
    {
        updateMetaFunction(index)
    }
}

function joinchat(name) 
{
    const index = names.indexOf(name)
    if(current!=names[index])
    {
        if(current)
        {
            const tempind = names.indexOf(current)
            socket.emit('exit',{username:me,room:rooms[tempind]})
        }
        document.querySelector('#messages').innerHTML=""
        document.querySelector('.chat__main2').style.display='none'
        document.querySelector('.chat__main').style.display='flex'
        var width = window.innerWidth|| document.documentElement.clientWidth|| document.body.clientWidth;
        if(width<=650)
        {
            document.querySelector('#sidebar').style.display="none"
            document.querySelector('#spacer').style.display="none"
            document.querySelector('#chatinfometa').style.display="none"
        }
        else{
            document.querySelector('.chat__sidebar').style.width="225px"
        }

        if(index>-1)
        {
            current = names[index]
            document.querySelector('#personname').textContent=current
            const {username, room}= {username: me,room:rooms[index]}
            socket.emit('join',{username,room}, (error)=>{
                if(error)
                {
                    alert(error)
                    location.href='/'
                }
                messagesRender(index)
            })
        }
    }
    else{
        var width = window.innerWidth|| document.documentElement.clientWidth|| document.body.clientWidth;
        if(width<=650)
        {
            document.querySelector('#sidebar').style.display="none"
            document.querySelector('.chat__main').style.display='flex'
        }
    }
}

//render messages
socket.on('message', (message)=>{

    if(message.username===me)
    {
        const html = Mustache.render(locationMessageTemplate,{
            message: message.text,
            createdAt: moment(message.createdAt).format('h:mm a')
        })
        messages.insertAdjacentHTML('beforeend',html)
        autoscroll()
    }
    else{
        const html = Mustache.render(messageTemplate,{
            message: message.text,
            createdAt: moment(message.createdAt).format('h:mm a')
        })
        messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
    }
    
})

//send message
messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    formButton.setAttribute('disabled','disabled')
    //disable the send button while the message is being sent
    const message = e.target.elements.message.value
    //const timestamp = Date.now();
    const timestamp = moment().toISOString();
    const roomind = names.indexOf(current)
    formInput.value=''
    formInput.focus()
    socket.emit("sendMessage",{room:rooms[roomind],username:me,message},(error)=>{        
        var width = window.innerWidth|| document.documentElement.clientWidth|| document.body.clientWidth;
        if(width<=650)
        {
            messages.scrollTop = messages.scrollHeight
        }                
        if(error)
        {
            alert(error)
            formButton.removeAttribute('disabled')
        }
        else
        {
            fetch('/message/send?id='+rooms[roomind]+'&message='+message+'&sender='+me+'&time='+timestamp).then((response)=>{
                response.json().then((data) => {
                    formButton.removeAttribute('disabled')
                    if (data.error) {
                        console.log("error")
                        console.log(data.error)
                    } else {
                        socket.emit('newmessage',{notif: rooms[roomind], room:friends[roomind]})
                        var tempind = position.indexOf(rooms[roomind])
                        if(tempind>-1)
                        {
                            position.splice(tempind,1)
                        }
                        position.unshift(rooms[roomind])
                        var tempind = unseen.indexOf(rooms[roomind])
                        if(tempind>-1)
                        {
                            unseen.splice(tempind,1)
                        }
                        unseen.unshift(rooms[roomind])
                        sidebarRender()
                    }
                })
            })  
        }
    })
            
})


function autoscroll()
{
    if( (messages.scrollHeight-messages.offsetHeight)<=(messages.scrollTop+messages.offsetHeight))
    {
        messages.scrollTop = messages.scrollHeight
    }
}

var temptimeout
socket.on('typing',(mode)=>
{
    if(mode===1)
    {
        document.querySelector('#info-message').textContent=`${current} is typing...`
    }
    else
    {
        if(temptimeout!=undefined)
        {
            clearTimeout(temptimeout)
        }
        temptimeout=setTimeout(() => {  
            document.querySelector('#info-message').textContent=""
         }, 1000);
    }
})

socket.on('newmessage', (notif)=>{
    //console.log("here")
    var flag=0
    var tempindex = names.indexOf(current)
    if(tempindex>-1)
    {
        if(rooms[tempindex]===notif)
        {
            flag=1
        }
    }
    if(flag==1){
        var index = position.indexOf(notif)
            if(index>-1)
            {
                position.splice(index,1)
                position.unshift(notif)
            }
            updateMetaFunction(tempindex)
    }
    else
    {
        var index = position.indexOf(notif)
        if(index>-1)
        {
            position.splice(index,1)
            position.unshift(notif)
        }
        var index = newmsgs.indexOf(notif)
        if(index>-1)
        {
            newmsgs.splice(index,1)
        }
        newmsgs.unshift(notif)
        //console.log("loading.......")
        var x= rooms.toString()
        fetch('/chats/all?ids='+x).then((response)=>{
            response.json().then((data) => {
                if (data.error) {
                    console.log(data.error)
                    //window.location.pathname = '/login'
                } else {
                    allmsgs= data
                    //console.log(data)
                    sidebarRender()
                }
            })
        })
    }  
    
})

function startedTyping()
{
    const tempind = names.indexOf(current)
    mode=1
    socket.emit('typing',{mode, room:rooms[tempind]})

    if(temptimeout!=undefined)
    {
        clearTimeout(temptimeout)
    }
    temptimeout=setTimeout(stoppedTyping, 2000);
}

function stoppedTyping()
{
    const tempind = names.indexOf(current)
    mode=0
    socket.emit('typing',{mode, room:rooms[tempind]})
}

function showMore()
{
    const index = names.indexOf(current)
    fetch('/chats/old?id='+rooms[index]).then((response)=>{
        response.json().then((data) => {
            if (data.error) {
                messageOne.textContent = data.error
                window.location.pathname = '/login'
            } else {
                oldchats= data.messages
                oldChatsRender()
            }
        })
    })
}

function oldChatsRender()
{
    document.querySelector('#messages').innerHTML=""
    for(i=0;i<oldchats.length;i++)
    {
        if(oldchats[i].sender===me)
        {
            const html = Mustache.render(locationMessageTemplate,{
                message: oldchats[i].message,
                createdAt: moment(oldchats[i].time).format('h:mm a')
            })
            messages.insertAdjacentHTML('beforeend',html)
            messages.scrollTop = messages.scrollHeight
        }
        else if(oldchats[i].sender==='System')
        {
            const html = Mustache.render(messageTemplate,{
                message: "Hello",
                //createdAt: "System"
            })
            messages.insertAdjacentHTML('beforeend',html)
            messages.scrollTop = messages.scrollHeight
        }
        else{
            const html = Mustache.render(messageTemplate,{
                message: oldchats[i].message,
                createdAt: moment(oldchats[i].time).format('h:mm a')
            })
            messages.insertAdjacentHTML('beforeend',html)
            messages.scrollTop = messages.scrollHeight
        }
    }
}


function collapse()
{
    document.querySelector('.chat__main').style.display="none"
    document.querySelector('.chat__sidebar').style.display="block"
    document.querySelector('#chatinfometa').style.display="block"
    document.querySelector('#spacer').style.display="block"
}
window.onpopstate = function() {
    var width = window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;
    if(width<=650)
    {
        collapse()
    }
 }; history.pushState({}, '');

function updateMetaFunction(index)
{
    fetch('/update/meta?room='+rooms[index]+'&friend='+friends[index]).then((response)=>{
        response.json().then((data) => {
            if (data.error) {
                console.log(data.error)                
            }
        })
    })
    const tempsearchind = newmsgs.indexOf(rooms[index])
    if(tempsearchind >-1)
    {
        newmsgs.splice(tempsearchind,1)
    }
    sidebarRender()
}



// const autoscroll=()=>{
//     //grab the last element to be rendered
//     const newMessage = messages.lastElementChild
//     //get the height of the last message
//     const newMessageStlyes = getComputedStyle(newMessage)
//     const newMessageMargin = parseInt(newMessageStlyes.marginBottom)
//     const newMessageHeight = newMessage.offsetHeight+newMessageMargin
//     //visible height
//     const visibleHeight = messages.offsetHeight
//     //height of messages container
//     const containerHeight = messages.scrollHeight
//     //how far has a user scrolled
//     const scrollOffset = messages.scrollTop + visibleHeight

//     if(containerHeight-newMessageHeight <= scrollOffset){
//         messages.scrollTop = messages.scrollHeight
//     }
// }

// socket.on('locationMessage', (msg)=>{
//     console.log(msg)
//     const html = Mustache.render(locationMessageTemplate,{
//         username: msg.username,
//         url: msg.url,
//         createdAt: moment(msg.createdAt).format('h:mm a')
//     })
//     messages.insertAdjacentHTML('beforeend',html)
//     autoscroll()
// })

// sendLocationButton.addEventListener('click',(e)=>{
//     e.preventDefault()

//     sendLocationButton.setAttribute('disabled','disabled')

//     if(!navigator.geolocation)
//     {
//         return alert('Geolocation is not supported by your browser')
//     }

//     navigator.geolocation.getCurrentPosition((position)=>{
//         socket.emit('sendLocation',{
//             latitude: position.coords.latitude,
//             longitude: position.coords.longitude
//         },()=>{
//             sendLocationButton.removeAttribute('disabled')
//             console.log('location shared')
//         })
//     })
// })