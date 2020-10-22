console.log('Client side javascript file is loaded!')

const messageOne = document.querySelector('#message-1')

document.getElementById("interests").onclick = function () {
    location.href = "/interests";
};

messageOne.textContent = "Loading..."


fetch('/process/interests/you').then((response)=>{
    response.json().then((data) => {
        if (data.error) {
            window.location.pathname = '/login'
        } else {
            for(i=1;i<=10;i++)
            {
                document.querySelector(`#message-${i}`).textContent=data.interests[i-1]
                
            }
        }
    })
})
