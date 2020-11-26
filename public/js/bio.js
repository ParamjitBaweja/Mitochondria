
const init = decodeURIComponent(window.location.search).split("=")[1]
if(init!=undefined){
    document.querySelector('#textareabox').value=init
}

function getText() 
{
    var text = document.getElementById("textareabox").value;
    if(text==="")
    {
        alert("Please write a bio")
    }
    else
    {
        fetch('/process/bio?bio='+text).then((response)=>{
            response.json().then((data) => {
                if (data.error) {
                    messageOne.textContent = data.error
                    window.location.pathname = '/login'
                } else {
                    window.location.pathname = '/profile'
                }
            })
        })
    }
}