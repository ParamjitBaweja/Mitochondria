const nodemailer = require('nodemailer');

  
const sendWelcomeEmail = (email,name)=>{
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL,
      pass: process.env.PASS
    }
  })
  const mailOptions = {
    from: process.env.MAIL,
    to: email,
    subject: 'Welcome',
    html: `<h1>Welcome ${name},</h1><p>Your account was created successfully.</p>
    <p>You are one of the first few to be using Mitochondria, which is currently being beta-tested.</p>
    <p>Since this is not the final edition of Mitochondria, there are bound to be a few shortcomings, and we would much appreciate your feedback about the same.</p>
    <p>Please send any and all feedback and queries to: mitochondria.emails@gmail.com</p>
    <p>This is a system generated mail, please do not reply to it.</p>`
  }
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  })
}


const sendCancellationEmail = async (email,name)=>{
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL,
      pass: process.env.PASS
    }
  })
  const mailOptions = {
    from: process.env.MAIL,
    to: email,
    subject: 'Account deletion confirmation',
    text: `Goodbye ${name}, we are sorry to see you go. Your account was deleted successfully.`,
  }
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  })
}

const verifEmail = (email,name, id)=>{
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL,
      pass: process.env.PASS
    }
  })
  console.log(email)
  const mailOptions = {
    from: process.env.MAIL,
    to: email,
    subject: 'Verify your email address',
    html: `<!DOCTYPE html PUBLIC “-//W3C//DTD XHTML 1.0 Transitional//EN” “https://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd”>
    <html xmlns=”https://www.w3.org/1999/xhtml”><body>
    <head>
      <title>Verify email</title>
    </head>
    <body>
    <p>Hello ${name},</p>
    <p>Verify your email address by clicking on the button below</p>
    <br>
    <form action="${process.env.HOST_URL}/verify/${id}" method="get">
         <button type="submit">Verify</button>
      </form>
      <br>
      <p>The link to the same being</p>
      <p><a href="${process.env.HOST_URL}/verify/${id}">Verify</a></p>
      <br>
      <p>If the above don't work, paste this link in your browser: ${process.env.HOST_URL}/verify/${id} </p>
      <br>
      <p>If you did not ask to reset your password, please ignore this message.</p>
      <p>This link will stay valid for 15 minutes since the moment it was generated.</p>
      <p>This is a system generated mail, please do not reply to it.</p>
      </body></html>`
  }
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  })
}

const forgotPassword = (email,name, id)=>{
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL,
      pass: process.env.PASS
    }
  })
  console.log(email)
  const mailOptions = {
    from: process.env.MAIL,
    to: email,
    subject: 'Reset your password',
    html: `
    <!DOCTYPE html PUBLIC “-//W3C//DTD XHTML 1.0 Transitional//EN” “https://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd”>
    <html xmlns=”https://www.w3.org/1999/xhtml”><body>
    <head>
      <title>Reset password</title>
    </head>
    <body>
    <p>Hello ${name},</p>
    <p>Reset your password by clicking on the button below</p>
    <br>
    <form action="${process.env.HOST_URL}/reset/${id}" method="get">
         <button type="submit">Reset</button>
      </form>
      <br>
      <p>The link to the same being</p>
      <p><a href="${process.env.HOST_URL}/reset/${id}">Reset</a></p>
      <br>
      <p>If the above don't work, paste this link in your browser: ${process.env.HOST_URL}/reset/${id} </p>
      <br>
      <p>This link will stay valid for 15 minutes since the moment it was generated.</p>
      <p>This is a system generated mail, please do not reply to it.</p></body></html>`
  }
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  })
}

module.exports={
  sendWelcomeEmail,
  sendCancellationEmail,
  verifEmail,
  forgotPassword
}

  