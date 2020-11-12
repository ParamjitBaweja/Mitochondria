console.log('Client side javascript file is loaded!')

const messageOne = document.querySelector('#message-1')
const messageTwo = document.querySelector('#message-2')
const messageThree = document.querySelector('#message-3')
const messageFour = document.querySelector('#message-4')

var index =0
var me = new Array()
var match = new Array()
var interests= new Array()
var owners= new Array()
var filter = 0
var bio= new Array()
var age = new Array()
var profileOwner = new Array()
var min=0
var blocked = new Array()
var rec = new Array()
var seen = new Array()
var friends = new Array()
var sent = new Array()

document.getElementById("next").onclick = function () {
    next();
};

document.getElementById("previous").onclick = function () {
    previous();
};

document.getElementById("home").onclick = function () {
    window.location.pathname = '/profile'
};

document.getElementById("request").onclick = function () {
    document.getElementById('request').style.display='none'
    document.getElementById('next').style.display='none'
    document.getElementById('previous').style.display='none'
    document.getElementById('home').style.display='none'
    document.getElementById('more').style.display='none'
    fetch('/people/send?id='+owners[index]).then((response)=>{
            response.json().then((data) => {
                if (data.error) {
                    console.log("error")
                    console.log(data.error)
                } else {
                    console.log("sent")
                    console.log(match)
                    console.log(index)
                    interests.splice(index,1)
                    owners.splice(index,1)
                    match.splice(index,1)
                    console.log(match)
                    if((index-min)==(owners.length))
                    {
                        document.getElementById('more').style.display='inline-block'
                        document.getElementById('home').style.display='inline-block'
                        return noprofiles()
                    }
                    index--
                    document.getElementById('request').style.display='inline-block'
                    document.getElementById('next').style.display='inline-block'
                    document.getElementById('previous').style.display='inline-block'
                    document.getElementById('home').style.display='inline-block'
                    next()
                }
            })
        })
};

document.getElementById("more").onclick = function () {
    if(index===owners.length-1)
    {
        messageOne.textContent = "There are no more users to show you."
        document.getElementById('home').style.display='inline-block' 
        document.getElementById('previous').style.display='none'
        document.getElementById('next').style.display='none'
        document.getElementById('more').style.display='none'
        document.getElementById('info').style.display='none'
    }
    else
    {load();}
};
messageOne.textContent = "Loading..."


fetch('/process/seen').then((response)=>{
    response.json().then((data) => {
        if(data.error)
        {
            console.log(data.error)
        }
        seen=data.ids
        //seen=[]
        if(seen===undefined)
        {
            seen=[]
        }

fetch('/requests/all').then((response)=>{
    response.json().then((data) => {
        if(data.error)
        {
            console.log(data.error)
        }
        blocked = data.blocked
        rec = data.rec
        friends = data.friends
        //friends=[]
        sent = data.sent
        //sent=[]

fetch('/process/interests/you').then((response)=>{
    response.json().then((data) => {
        if (data.error) {
            window.location.pathname = '/login'
        } 
        else {
            me=data.interests
            filter = data.owner
            messageOne.textContent = 'Sorting users based on your interests...'
            fetch('/process/people').then((response)=>{
                response.json().then(async(data) => {
                    if(data.error)
                    {
                        console.log(data.error)
                    }
                    interests = data.interests
                    owners = data.owners
                    console.log(owners)
                    //remove blocked profiles
                    if(blocked.length>0)
                    {
                        for(i=0; i<blocked.length; i++)
                        {
                            const tempindexfilter = owners.indexOf(blocked[i])
                            if(tempindexfilter>-1)
                            {
                                owners.splice(tempindexfilter,1)
                                interests.splice(tempindexfilter,1)
                            }
                        }
                    }
                    //remove profiles you have recieved a request from
                    if(rec.length>0)
                    {
                        for(i=0; i<rec.length; i++)
                        {
                            const tempindexfilter = owners.indexOf(rec[i])
                            if(tempindexfilter>-1)
                            {
                                owners.splice(tempindexfilter,1)
                                interests.splice(tempindexfilter,1)
                            }
                        }
                    }
                    //remove profiles you have sent a request to
                    if(sent.length>0)
                    {
                        for(i=0; i<sent.length; i++)
                        {
                            const tempindexfilter = owners.indexOf(sent[i])
                            if(tempindexfilter>-1)
                            {
                                owners.splice(tempindexfilter,1)
                                interests.splice(tempindexfilter,1)
                            }
                        }
                    }
                    //remove profiles you are friends with
                    if(friends.length>0)
                    {
                        for(i=0; i<friends.length; i++)
                        {
                            const tempindexfilter = owners.indexOf(friends[i])
                            if(tempindexfilter>-1)
                            {
                                owners.splice(tempindexfilter,1)
                                interests.splice(tempindexfilter,1)
                            }
                        }
                    }
                    //remove seen profiles
                    if(seen.length>0)
                    {
                        for(i=0; i<seen.length; i++)
                        {
                            const tempindexfilter = owners.indexOf(seen[i])
                            if(tempindexfilter>-1)
                            {
                                owners.splice(tempindexfilter,1)
                                interests.splice(tempindexfilter,1)
                            }
                        }
                    }
                    //remove your own profile
                    for(i=0;i<owners.length;i++)
                    {
                        if(owners[i]===filter)
                        {
                            for(j=i;j<owners.length-1;j++){
                                owners[j]=owners[j+1]
                                interests[j]= interests[j+1]
                            }
                            owners.pop()
                            interests.pop()
                        }
                    }
                    console.log(owners)
                    //check if there are any profiles left after filtering
                    if(owners.length==0)
                    {
                        return endofprofiles()
                    }
                    //determine the matches
                    for(i=0; i< interests.length;i++)
                    {
                        var u = interests[i]
                        var count =0
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
                        match.push(count)
                    }
                    //sort according to your profile
                    for(j=0;j<match.length;j++)
                    {
                        for(i=0;i<match.length-1;i++)
                        {
                            if(match[i]<match[i+1])
                            {
                                var temp1 = match[i]
                                match[i]= match[i+1]
                                match[i+1]= temp1
                                var temp2 = interests[i]
                                interests[i]= interests[i+1]
                                interests[i+1]= temp2
                                var temp3 = owners[i]
                                owners[i]= owners[i+1]
                                owners[i+1]= temp3
                            }
                        }
                    }   
                    var len=0                 
                    owners.length>10?len=10:len=owners.length
                    var tempowners = new Array()
                    for(i=0;i<len;i++)
                    {
                        tempowners[i]=owners[i]
                    }
                    var x = tempowners.toString();
                    messageOne.textContent= 'Fetching profiles...'
                    fetch('/process/people/profiles?ids='+x).then((response)=>{
                        response.json().then((data) => {
                            if (data.error) {
                                messageOne.textContent = data.error
                                window.location.pathname = '/login'
                            } else {
                                age = data.age
                                bio = data.bio
                                profileOwner = data.owner
                                document.getElementById('info').style.display='block' 
                                messageOne.textContent= match[index]+'/10 of your interests match'
                                messageTwo.textContent= interests[index].join(', ')
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
                                if((index-min)==(owners.length-1))
                                {
                                    document.getElementById('next').style.display='none'
                                    document.getElementById('more').style.display='inline-block'
                                }
                                else{
                                    document.getElementById('next').style.display='inline-block'
                                    document.getElementById('more').style.display='none'
                                                }
                                            }
                                        })
                                    })
                                })
                            })
                        }
                    })
                })
            })
        })
    })
})

function next()
{
    if((owners.length-min)==0)
    {
        return noprofiles()
    }
    index++
    if(index==0)
    {
        document.getElementById('previous').style.display='none'
    }
    else
    {document.getElementById('previous').style.display='inline-block' }
    if((index-min)==(owners.length-1))
    {
        document.getElementById('next').style.display='none'
        document.getElementById('more').style.display='inline-block'
    }
    else{
        document.getElementById('next').style.display='inline-block'
        document.getElementById('more').style.display='none'
    }
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; //for chrome etc
    messageOne.textContent= match[index]+'/10 of your interests match'
    messageTwo.textContent= interests[index].join(', ')
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
    //console.log(bio.length)
}

function previous()
{
    index--
    if(index==min)
    {
        document.getElementById('previous').style.display='none' 
        document.getElementById('next').style.display='inline-block'
        document.getElementById('more').style.display='none'
    }
    else
    {
        document.getElementById('previous').style.display='inline-block'
        document.getElementById('next').style.display='inline-block'
        document.getElementById('more').style.display='none'
    }
    // if(index==min){
    //     document.getElementById('previous').style.display='none' 
    // }

    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; //for chrome etc
    messageOne.textContent= match[index]+'/10 of your interests match'
    messageTwo.textContent= interests[index].join(', ')
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

function load()
{
    age=[]
    bio=[]
    profileOwner=[]
    min=index+1
    messageOne.textContent = "Loading..."
    document.getElementById('previous').style.display='none'
    document.getElementById('next').style.display='none'
    document.getElementById('more').style.display='none'
    document.getElementById('info').style.display='none' 
    var len=0                 
    if((owners.length-index-1)>10)
    {
            len=10
    }
    else
    {
        len=(owners.length-index-1)
    }
    var tempowners = new Array()
    for(j=0,i=index+1;i<(len+index+1);j++,i++)
    {
        tempowners[j]=owners[i]
    }
    //console.log(tempowners)
    if(tempowners.length==0)
    {
        return endofprofiles()
    }
    var x = tempowners.toString();
    fetch('/process/people/profiles?ids='+x).then((response)=>{
        response.json().then((data) => {
            if (data.error) {
                messageOne.textContent = data.error
                //console.log(data.error)
                //window.location.pathname = '/login'
            } else {
                age=data.age
                bio=data.bio
                profileOwner=data.owner
                document.getElementById('info').style.display='block' 
                index++
                messageOne.textContent= match[index]+'/10 of your interests match'
                messageTwo.textContent= interests[index].join(', ')
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
                if((index-min)==(owners.length-1))
                {
                    document.getElementById('next').style.display='none'
                    document.getElementById('more').style.display='inline-block'
                }
                else{
                    document.getElementById('next').style.display='inline-block'
                    document.getElementById('more').style.display='none'
                }
                
            }
        })
    })
}

function noprofiles()
{
    messageOne.textContent= "You seem to have reached the end"
    document.getElementById('previous').style.display='none'
    document.getElementById('next').style.display='none'
    document.getElementById('more').style.display='inline-block'
    document.getElementById('info').style.display='none'
}

function endofprofiles()
{
    messageOne.textContent= "There are no more profiles for you to see"
    document.getElementById('previous').style.display='none'
    document.getElementById('next').style.display='none'
    document.getElementById('more').style.display='none'
    document.getElementById('info').style.display='none'
}

// next
//chnage display value of div to block
//increase the counter and display the details
//when you reach the end of the array, change display value of show more to block
//show more should call load()


//load()
// copy paste the initial function that is loading the 1st 10 profiles
//use global variables to load the next 10/ the next till how many ever are left



// document.getElementById("logout").onclick = function () {
//     fetch('/process/logout').then((response)=>{
//         response.json().then((data) => {
//             if(data.error)
//             {
//                 window.location.pathname = '/login'
//             }
//             window.location.pathname = '/login'
//         })
//     })
// };
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



// fetch('/process/profile').then((response)=>{
//     response.json().then((data) => {
//         if (data.error) {
//             window.location.pathname = '/login'
//         } else {
//             if(data.bio==="")
//             {
//                 window.location.pathname = '/details'
//             }
//             messageOne.textContent = data.name
//             messageTwo.textContent = data.email
//             messageThree.textContent=data.age
//             messageFour.textContent=data.bio
//         }
//     })
// })
