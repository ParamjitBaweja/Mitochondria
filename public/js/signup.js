console.log('Client side javascript file is loaded!')

const loginForm = document.querySelector('form')
const email = document.querySelector('#email')
const name = document.querySelector('#name')
const age = document.querySelector('#age')
const password = document.querySelector('#password')
const messageOne = document.querySelector('#message-1')
const login = document.querySelector('#signup')
const repass = document.querySelector('#re-password')


login.addEventListener("click", (e) => {
    e.preventDefault()
    //const location = search.value
    messageOne.textContent = "Loading..."
    console.log(repass.value)
    console.log("repass.value")
    fetch(
        '/process/signup?email='+email.value+'&password='+password.value+'&name='+name.value
        +'&age='+age.value+'&repass='+repass.value
    ).then((response)=>{
        response.json().then((data) => {
            if (data.error) {
                messageOne.textContent = data.error
            } else {
                messageOne.textContent = "We have sent you a verification e-mail, please verify your account to continue."
            }
        })
    })
})