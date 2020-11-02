console.log('Client side javascript file is loaded!')

const loginForm = document.querySelector('form')
const password = document.querySelector('#password')
const messageOne = document.querySelector('#message-1')
const login = document.querySelector('#reset')
const repass = document.querySelector('#re-password')

var link = location.pathname.split("/")

login.addEventListener("click", (e) => {
    e.preventDefault()
    messageOne.textContent = "Loading..."
    fetch(
        '/process/reset?password='+password.value+'&repass='+repass.value+'&id='+link[2]
    ).then((response)=>{
        response.json().then((data) => {
            if (data.error) {
                messageOne.textContent = "Your link seems to have expired, please try again"
            } else {
                messageOne.textContent = "Please wait..."
                window.location.pathname = '/login'
            }
        })
    })
})