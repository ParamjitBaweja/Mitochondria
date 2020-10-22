const axios = require('axios')

const login = async function(email, password, callback)  
{
  const bodyParameters = {
  email,
  password
  };
  try{
    const response= await axios.post( 
    'https://mitochondria-api.herokuapp.com/users/login',
    bodyParameters
    )
    callback('',{
      name:response.data.user.name,
      token: response.data.token
    })
  }
  catch(error)
  {
    callback('Invalid Credentials', {})
  }
}

const signup = async function(email, password,name,age, callback)  
{
  const bodyParameters = {
    name,
    email,
    password,
    age
  };
  try{
    const response= await axios.post( 
    'https://mitochondria-api.herokuapp.com/users',
    bodyParameters
    )
    callback('',{})
  }
  catch(error)
  {
    console.log(error)
    callback(`This email seems to be registered with us. If you haven't verified your e-mail address yet, we will resend your verification e-mail. If you have, pleaes try logging in.`, {})
  }
}

const view = async function(token,callback)  
{
  
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    }
    const response = await axios.get('https://mitochondria-api.herokuapp.com/users/me',
    config
    )
    callback('',{
      name:response.data.name,
      email:response.data.email,
      age: response.data.age,
      bio: response.data.bio
    })
  }
  catch(error)
  {
    console.log(error)
    callback(error, {})
  }
}
const viewinterests = async function(token,callback)  
{
  
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    }
    const response = await axios.get('https://mitochondria-api.herokuapp.com/interests/me',
    config
    )
    console.log(response)
    callback('',{
      interests: response.data.interests,
      owner: response.data.owner
    })
  }
  catch(error)
  {
    console.log(error)
    callback(error, {})
  }
}
const details = async function(token,interests,callback)  
{
  
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    }
    const bodyParameters = {
      interests
    };
    const response = await axios.post('https://mitochondria-api.herokuapp.com/interests',
    bodyParameters,
    config
    )
    callback('')
  }
  catch(error)
  {
    callback(error)
  }
}
const updatebio = async function(token,bio,callback)  
{
  
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    }
    const bodyParameters = {
      bio
    };
    const response = await axios.patch('https://mitochondria-api.herokuapp.com/users/me',
    bodyParameters,
    config
    )
    console.log(response)
    callback('')
  }
  catch(error)
  {
    console.log(error)
    callback(error)
  }
}

const updateinterests = async function(token,interests,callback)  
{
  
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    }
    const bodyParameters = {
      interests
    };
    const response = await axios.patch('https://mitochondria-api.herokuapp.com/interests',
    bodyParameters,
    config
    )
    console.log(response)
    callback('')
  }
  catch(error)
  {
    console.log(error)
    callback(error)
  }
}

const logout = async function(token,callback)  
{
  
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    }
    const response = await axios.delete('https://mitochondria-api.herokuapp.com/users/logout',
    config
    )
    callback('')
  }
  catch(error)
  {
    callback(error)
  }
}

const logoutAll = async function(token,callback)  
{
  
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    }
    const response = axios.delete('https://mitochondria-api.herokuapp.com/users/logoutAll',
    config
    )
    callback('')
  }
  catch(error)
  {
    callback(error)
  }
}

const allInterests = async function(token,callback)  
{
  
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    }
    const response = await axios.get('https://mitochondria-api.herokuapp.com/interests',
    config
    )
    console.log(response)
    callback('',{
      interests: response.data.interests,
      owners: response.data.owners
    })
  }
  catch(error)
  {
    console.log(error)
    callback(error, {})
  }
}

const profiles = async function(token,ids,callback)  
{
  
  try {
    console.log("right before calling")
    console.log(token)
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    }
    const bodyParameters = {
      ids
    };
    const response = await axios.patch('https://mitochondria-api.herokuapp.com/profiles',
    bodyParameters,
    config
    )
    var age = new Array()
    var bio = new Array()
    var owner = new Array()
    console.log(response)
    for(i=0;i<response.data.length;i++){
      age[i]=response.data[i].age
      bio[i]=response.data[i].bio
      owner[i]=response.data[i]._id
    }
    callback('',{age, bio,owner})
  }
  catch(error)
  {
    console.log(error)
    callback("error",undefined)
  }
}

module.exports = {
  signup,
  login,
  view,
  details,
  updatebio,
  viewinterests,
  updateinterests,
  logout,
  logoutAll,
  allInterests,
  profiles
}
// const https = require('http')

// const data = JSON.stringify({
//     name: "para",
//     email: "jitendrabaweja@gmail.com",
//     password: "somethingrandom"
// })

// const options = {
//   hostname: 'param-task-api.herokuapp.com',
//   port: 80,
//   path: '/users/login',
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//     'Content-Length': data.length,
//   },
// }

// const req = https.request(options, (res) => {
//   console.log(`statusCode: ${res.statusCode}`)

//   res.on('data', (d) => {
//     process.stdout.write(d)
//   })
// })

// req.on('error', (error) => {
//   console.error(error)
// })

// req.write(data)
// req.end()

// Authentication: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjgzZDQyOTgyMTA5YjAwMTdkM2VkZGQiLCJpYXQiOjE2MDI0NzUwNDl9.YEXUwoohadsZlN_7U2cTeFNaGL1MBMt-9Eiyv-pZWzg



// var http = require('http');
// const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjgzZDQyOTgyMTA5YjAwMTdkM2VkZGQiLCJpYXQiOjE2MDI0NzUwNDl9.YEXUwoohadsZlN_7U2cTeFNaGL1MBMt-9Eiyv-pZWzg'
// //The url we want is: 'www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
// var options = {
//     hostname: 'param-task-api.herokuapp.com',
//     port: 80,
//     path: '/users/me',
//     method: 'GET',
//     headers:{
//         Authorization: `Bearer ${token}`
//     }
// };

// callback = function(response) {
//   var str = '';

//   //another chunk of data has been received, so append it to `str`
//   response.on('data', function (chunk) {
//     str += chunk;
//   });

//   //the whole response has been received, so we just print it out here
//   response.on('end', function () {
//     console.log(str);
//   });
// }

// http.request(options, callback).end();




// final



// const https = require('http')
// const login = (email, password) => 
// {
//   var dat=''
//   const data = JSON.stringify
//   ({
//     email,
//     password
//   })
      
//   const options = 
//   {
//     hostname: 'param-task-api.herokuapp.com',
//     port: 80,
//     path: '/users/login',
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Content-Length': data.length,
//     },
//   }
      
//   const req = https.request(options, (res) => 
//   {
//     console.log(`statusCode: ${res.statusCode}`)  
//     res.on('data', (d) => {
//       //process.stdout.write(d)
//     })
//   })
      
//   req.on('error', (error) => 
//   {
//     console.error(error,undefined)
//   })
//   req.write(data)
//   req.end()

// }

// module.exports = {
//   login
// }