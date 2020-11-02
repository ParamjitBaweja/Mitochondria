console.log('Client side javascript file is loaded!')

const loginForm = document.querySelector('form')
const email = document.querySelector('#email')
const password = document.querySelector('#password')
const messageOne = document.querySelector('#message-1')
const messageTwo = document.querySelector('#message-2')
const login = document.querySelector('#login')


login.addEventListener("click", (e) => {
    e.preventDefault()
    //const location = search.value
    messageOne.textContent = "Loading..."
    messageTwo.textContent = ''

    fetch('/process/login?email='+email.value+'&password='+password.value).then((response)=>{
        response.json().then((data) => {
            if (data.error) {
                messageOne.textContent = data.error
            } else {
                messageOne.textContent = "Please wait..."
                window.location.pathname = '/'
            }
        })
    })

    // fetch('/weather?address=' + location).then((response) => {
    //     response.json().then((data) => {
    //         if (data.error) {
    //             messageOne.textContent = data.error
    //         } else {
    //             messageOne.textContent = data.location
    //             messageTwo.textContent = data.forecast
    //         }
    //     })
    // })
})