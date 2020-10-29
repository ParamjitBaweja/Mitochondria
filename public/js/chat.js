const socket = io()

//Elements
const messageForm = document.querySelector('#messageData')
const formInput = messageForm.querySelector('input')
const formButton = messageForm.querySelector('button')
const sendLocationButton = document.querySelector('#send-location')
const messages = document.querySelector('#messages')

//Templates
const messageTemplate= document.querySelector('#message-template').innerHTML
const locationMessageTemplate= document.querySelector('#locationMessage-template').innerHTML
const sidebarTemplate= document.querySelector('#sidebar-template').innerHTML

//options
//const {username, room}=Qs.parse(location.search,{ignoreQueryPrefix:true})

const {username, room}= {username: 'a', room: 'b'}

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

socket.emit('join',{username,room}, (error)=>{
    if(error)
    {
        alert(error)
        location.href='/'
    }
})

socket.on('message', (message)=>{
    console.log(message)
    const html = Mustache.render(messageTemplate,{
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('locationMessage', (msg)=>{
    console.log(msg)
    const html = Mustache.render(locationMessageTemplate,{
        username: msg.username,
        url: msg.url,
        createdAt: moment(msg.createdAt).format('h:mm a')
    })
    messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('roomData',({room,users})=>
{
    const html = Mustache.render(sidebarTemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML=html
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
            return console.log(error)
        }
        console.log('message delivered')
    })
})

sendLocationButton.addEventListener('click',(e)=>{
    e.preventDefault()

    sendLocationButton.setAttribute('disabled','disabled')

    if(!navigator.geolocation)
    {
        return alert('Geolocation is not supported by your browser')
    }

    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation',{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        },()=>{
            sendLocationButton.removeAttribute('disabled')
            console.log('location shared')
        })
    })
})