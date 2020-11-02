console.log('Client side javascript file is loaded!')

const loginForm = document.querySelector('form')
const email = document.querySelector('#email')
const messageOne = document.querySelector('#message-1')
const messageTwo = document.querySelector('#message-2')
const submit = document.querySelector('#submit')


submit.addEventListener("click", (e) => {
    e.preventDefault()
    messageOne.textContent = "Loading..."
    messageTwo.textContent = ''

    fetch('/process/forgot?email='+email.value).then((response)=>{
        response.json().then((data) => {
            if (data.error) {
                messageOne.textContent = data.error
            } else {
                messageOne.textContent = "A password reset link has been sent to your registered email address."
            }
        })
    })
})