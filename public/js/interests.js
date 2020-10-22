const messageOne = document.querySelector('#message-1')
const form = document.querySelector('#interests')
var interest = new Array()
var flg = new Array()
var interests= new Array()
function GetSelected(tag)
{
    var flag=0
    for(i=0; i<interest.length;i++)
    {
        if(interest[i]===tag){
            flag=1
            if(flg[i]===0)
            {
                flg[i]=1
                interests.push(tag)
                document.getElementById(tag).style.color = "white";
            }
            else if(flg[i]===1){
                flg[i]=0
                document.getElementById(tag).style.color = "black";
                for(j=0;j<interests.length;j++)
                {
                    if(interests[j]===tag)
                    {
                        for(k=j;k<interests.length-1;k++)
                        {
                            interests[j]=interests[j+1]
                        }
                    }
                }
                interests.pop()
            }
        }
    }
    if(flag ===0){
        interest.push(tag)
        flg.push(1)
        interests.push(tag)
        document.getElementById(tag).style.color = "white";
    }
    messageOne.textContent = `${interests.length} of 10 selected`
    if(interests.length == 10)
    {
        messageOne.textContent = "Please wait..."
        form.style.display='none'
        var x = interests.toString();
        fetch('/process/interests?interests='+x).then((response)=>{
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
function myFunction() 
{
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    ul = document.getElementById("interests");
    li = ul.getElementsByTagName("INPUT");
    for (i = 0; i < li.length; i++) {
        a = li[i];
        txtValue = a.textContent || a.innerText || a.value;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "inline-block";
        } else {
            li[i].style.display = "none";
        }
    }
}

// const messageOne = document.querySelector('#message-1')



// const interests = document.querySelector('#interests')

// interests.addEventListener("click", (e) => {
//     e.preventDefault()
//     var selected = new Array();
//     var chks = interests.getElementsByTagName("INPUT");
//     for (var i = 0; i < chks.length; i++) {
//         if (chks[i].checked) {
//             selected.push(chks[i].value);
//         }
//     }
//     messageOne.textContent = selected.length
//     //Display the selected CheckBox values.
//     if (selected.length > 0) {
//         console.log("Selected values: " + selected.join(","));
//     }
// })

