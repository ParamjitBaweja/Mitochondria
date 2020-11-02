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


//variables
var friends = new Array()
var names = new Array()
var rooms = new Array()
var position = new Array()
var me=''
var current=''

messageZero.textContent = "Loading..."

document.getElementById("findpeople").onclick = function () {
    location.href = "/people";
};

//render contacts in the sidebar
fetch('/requests/all').then((response)=>{
    response.json().then((data) => {
        if(data.error)
        {
            window.location.pathname = '/login'
        }
        friends = data.friends
        names = data.names
        rooms= data.rooms
        position=data.position
        me=data.owner
        if(friends.length==0)
        {
            document.getElementById("findpeople").style.display='block'
            messageZero.textContent = "You have no chats. Please find people to proceed."
        }
        else{
        messageZero.textContent = ""
        }
        for(i=0; i < position.length;i++)
        {
            const index = rooms.indexOf(position[i])
            const html = Mustache.render(sidebarTemplate,{
                friendname: names[index]
            })
            //console.log(names[index])
            document.querySelector('#sidebar').insertAdjacentHTML('beforeend',html)
        }
        
    })
})

const autoscroll=()=>{
    //grab the last element to be rendered
    const newMessage = messages.lastElementChild
    //get the height of the last message
    const newMessageStlyes = getComputedStyle(newMessage)
    const newMessageMargin = parseInt(newMessageStlyes.marginBottom)
    const newMessageHeight = newMessage.offsetHeight+newMessageMargin
    //visible height
    const visibleHeight = messages.offsetHeight
    //height of messages container
    const containerHeight = messages.scrollHeight
    //how far has a user scrolled
    const scrollOffset = messages.scrollTop + visibleHeight

    if(containerHeight-newMessageHeight <= scrollOffset){
        messages.scrollTop = messages.scrollHeight
    }
}

function joinchat(name) 
{
    const index = names.indexOf(name)
    if(current!=names[index])
    {
        document.querySelector('.chat__main').style.display='flex'
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
            })
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

messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()

    formButton.setAttribute('disabled','disabled')
    //disable the send button while the message is being sent

    const message = e.target.elements.message.value
    socket.emit("sendMessage",message,(error)=>{
        
        formButton.removeAttribute('disabled')
        formInput.value=''
        formInput.focus()
        //re-enable the send button after the message is sent
        //clear the input box of all text
        //bring the cursor back to the start of the box

        if(error)
        {
            if(error==='refresh')
            {
                window.location.pathname = '/'
            }
            return console.log(error)
        }
        console.log('message delivered')
    })
})

function startedTyping()
{
    mode=1
    socket.emit('typing',mode)
}
function stoppedTyping()
{
    mode=0
    socket.emit('typing',mode)
}


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