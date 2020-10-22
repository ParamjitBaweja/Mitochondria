console.log('Client side javascript file is loaded!')

const messageOne = document.querySelector('#message-1')
const messageTwo = document.querySelector('#message-2')
const messageThree = document.querySelector('#message-3')
const messageFour = document.querySelector('#message-4')

document.getElementById("bio").onclick = function () {
    location.href = "/bio";
};
document.getElementById("interests").onclick = function () {
    location.href = "/interests/you";
};
document.getElementById("logout").onclick = function () {
    messageOne.textContent = "Logging you out...."
    fetch('/process/logout').then((response)=>{        
        response.json().then((data) => {
            // if(data.error)
            // {
            //     window.location.pathname = '/login'
            // }
            window.location.pathname = '/login'
        })
        window.location.pathname = '/login'
    })
};
// document.getElementById("logoutAll").onclick = function () {
//     fetch('/process/logout/all').then((response)=>{
//         response.json().then((data) => {
//             if(data.error)
//             {
//                 window.location.pathname = '/login'
//             }
//             window.location.pathname = '/login'
//         })
//     })
// };

messageOne.textContent = "Loading..."

fetch('/process/profile').then((response)=>{
    response.json().then((data) => {
        if (data.error) {
            window.location.pathname = '/login'
        } else {
            if(data.bio==="Bio not updated")
            {
                window.location.pathname = '/details'
            }
            messageOne.textContent = data.name
            messageTwo.textContent = data.email
            messageThree.textContent=data.age
            messageFour.textContent=data.bio
        }
    })
})
