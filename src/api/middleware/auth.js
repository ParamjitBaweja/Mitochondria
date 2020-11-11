const jwt = require('jsonwebtoken')
const User = require('../models/users')
const Token = require('../models/tokens')

const auth = async(req, res, next) =>
{
    try{
        const token = req.header('Authorization').replace('Bearer ','')
        //extracts the value from the header and
        //removes the "Bearer" from the value received 
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id : decoded._id})
        const tok = await Token.findOne({ 'tokens.token': token, owner : decoded._id})
        // looks for a user that has this value of token still stored, cuz when a user logs out, it is destroyed
        
        if(!user){
            throw new Error()
            //just throw an error the catch phrase below will catch it
        }
        if(!tok){
            throw new Error()
            //just throw an error the catch phrase below will catch it
        }
        req.token = token
        req.user = user
        req.tokenObject = tok
        next()
    }
    catch(e)
    {
        res.status(401).send({ error: " please authenticate."})
    }
}

module.exports = auth