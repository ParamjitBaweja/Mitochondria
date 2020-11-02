console.log('Client side javascript file is loaded!')
const messageZero= document.querySelector('#names')
const messageOne = document.querySelector('#message-1')
const messageTwo = document.querySelector('#message-2')
const messageThree = document.querySelector('#message-3')
const messageFour = document.querySelector('#message-4')

var index =0
var owners= new Array()
var names = new Array()
var bio= new Array()
var age = new Array()
var profileOwner = new Array()
var sent = new Array()
var rec  = new Array()
var friends = new Array()
var me = new Array()
var interestowners = new Array()
var interests = new Array()
var mode =0

fetch('/requests/all').then((response)=>{
    response.json().then((data) => {
        if(data.error)
        {
            window.location.pathname = '/login'
        }
        console.log(data)
        sent = data.sent
        rec = data.rec
        friends = data.friends
        names = data.names
        document.getElementById("sent").value = `Sent requests: ${sent.length}`
        document.getElementById("rec").value = `Recieved requests: ${rec.length}`
        document.getElementById("friends").value = `Friends: ${friends.length}`
    })
})

function sentfunc()
{
    if(sent.length>0)
    {
        mode=1
        owners = sent
        data()
    }
}
function recfunc()
{
    if(rec.length>0)
    {
        mode=2
        owners = rec
        data()
    }
}
function friendsfunc()
{
    if(friends.length>0)
    {
        mode =3
        owners = friends
        data()
    }
}
function backfunc()
{
    window.location.pathname = '/profile/people'
}
document.getElementById("next").onclick = function () {
    next();
};
document.getElementById("previous").onclick = function () {
    previous();
};
function requestfunc()
{
    document.getElementById('request').style.display='none'
    document.getElementById('next').style.display='none'
    document.getElementById('previous').style.display='none'
    fetch('/people/accept?id='+owners[index]).then((response)=>{
            response.json().then((data) => {
                if (data.error) {
                    console.log("error")
                    console.log(data.error)
                } else {
                    console.log("sent")
                    console.log(index)
                    //interests.splice(index,1)
                    owners.splice(index,1)
                    if(owners.length==0)
                    {
                        window.location.pathname = '/profile/people'
                    }
                    index--
                    document.getElementById('request').style.display='inline-block'
                    document.getElementById('next').style.display='inline-block'
                    document.getElementById('previous').style.display='inline-block'
                    next()
                }
            })
        })
};

function data()
{
    document.querySelector('.init').style.display='none'
    document.querySelector('.profiles').style.display='inline-block'
    messageOne.textContent = 'Please wait...'
    fetch('/process/interests/you').then((response)=>{
        response.json().then((data) => {
            if (data.error) {
                window.location.pathname = '/login'
            } 
            else {
                me=data.interests
                messageOne.textContent="Fetching profiles..." 
                fetch('/process/people').then((response)=>{
                    response.json().then(async(data) => {
                        if(data.error)
                        {
                            console.log(data.error)
                        }
                        interests = data.interests
                        interestowners = data.owners 
                        messageOne.textContent="Loading..."                      
                        fetch('/process/people/profiles?ids='+owners).then((response)=>{
                            response.json().then((data) => {
                                if (data.error) {
                                    messageOne.textContent = data.error
                                    window.location.pathname = '/login'
                                } else {
                                    age = data.age
                                    bio = data.bio
                                    profileOwner = data.owner
                                    document.getElementById('info').style.display='block'                                
                                    var count =0
                                    var tindex=0
                                    for(i=0;i<interestowners.length;i++)
                                    {
                                        if(interestowners[i]===owners[index])
                                        {                                           
                                            var u = interests[i]
                                            tindex = i                                            
                                            for(j=0;j<u.length;j++)
                                            {
                                                for(k=0;k<me.length;k++)
                                                {
                                                    if(u[j]==me[k])
                                                    {
                                                        count++
                                                    }
                                                }
                                            }  
                                        }
                                    }            
                                    if(mode==3)
                                    {
                                        messageZero.textContent=names[index]
                                    }
                                    messageOne.textContent= count+'/10 of your interests match'
                                    messageTwo.textContent= interests[tindex]
                                    for(i=0;i<profileOwner.length;i++)
                                    {
                                        if(profileOwner[i]===owners[index])
                                        {
                                            if(age[i]>=18)
                                            {messageThree.textContent = "Adult"}
                                            else{
                                                messageThree.textContent = "Teen"
                                            }
                                            messageFour.textContent = bio[i]
                                        }
                                    }
                                    if(mode==2)
                                    {
                                        document.querySelector('#request').value = "Accept Request"
                                        document.querySelector('#request').style.display='inline-block'
                                    }
                                    if((index)==(age.length-1))
                                    {
                                        document.getElementById('next').style.display='none'
                                        document.getElementById('back').style.display='inline-block'
                                    }
                                    else{
                                        document.getElementById('next').style.display='inline-block'
                                        document.getElementById('back').style.display='none'
                                    }
                                }
                            })
                        })                        
                    })
                })
            }
        })
    })
}
function next()
{
    index++
    if(index==0)
    {
        document.getElementById('previous').style.display='none'
    }
    else
    {
        document.getElementById('previous').style.display='inline-block' 
    }
    var count =0
    var tindex=0
    for(i=0;i<interestowners.length;i++)
    {
        if(interestowners[i]===owners[index])
        {                                           
            var u = interests[i]
            tindex = i                                            
            for(j=0;j<u.length;j++)
            {
                for(k=0;k<me.length;k++)
                {
                    if(u[j]==me[k])
                    {
                        count++
                    }
                }
            }  
        }
    }            
    if(mode==3)
    {
        messageZero.textContent=names[index]
    }
    messageOne.textContent= count+'/10 of your interests match'
    messageTwo.textContent= interests[tindex]
    for(i=0;i<profileOwner.length;i++)
    {
        if(profileOwner[i]===owners[index])
        {
            if(age[i]>=18)
            {messageThree.textContent = "Adult"}
            else{
                messageThree.textContent = "Teen"
            }
            messageFour.textContent = bio[i]
        }
    }
    if((index)==(bio.length-1))
    {
        document.getElementById('next').style.display='none'
        document.getElementById('back').style.display='inline-block'
    }
    else{
        document.getElementById('next').style.display='inline-block'
        document.getElementById('back').style.display='none'
    }
}
function previous()
{
    index--
    if(index==0)
    {
        document.getElementById('previous').style.display='none' 
        document.getElementById('next').style.display='inline-block'
    }
    else
    {
        document.getElementById('previous').style.display='inline-block'
        document.getElementById('next').style.display='inline-block'
    }
    var count =0
    var tindex=0
    for(i=0;i<interestowners.length;i++)
    {
        if(interestowners[i]===owners[index])
        {                                           
            var u = interests[i]
            tindex = i                                            
            for(j=0;j<u.length;j++)
            {
                for(k=0;k<me.length;k++)
                {
                    if(u[j]==me[k])
                    {
                        count++
                    }
                }
            }  
        }
    }            
    if(mode==3)
    {
        messageZero.textContent=names[index]
    }
    messageOne.textContent= count+'/10 of your interests match'
    messageTwo.textContent= interests[tindex]
    for(i=0;i<profileOwner.length;i++)
    {
        if(profileOwner[i]===owners[index])
        {
            if(age[i]>=18)
            {messageThree.textContent = "Adult"}
            else{
                messageThree.textContent = "Teen"
            }
            messageFour.textContent = bio[i]
        }
    }
}
