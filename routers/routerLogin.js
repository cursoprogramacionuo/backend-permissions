const express = require("express")
let routerLogin = express.Router();
let users = require("../data/user")
let authorizer = require("../data/authorizers")
let jwt = require("jsonwebtoken")

routerLogin.post("/", (req,res) => {
    let email = req.body.email
    let password = req.body.password

    let user = users.find(u => u.email == email && u.password == password)
    if ( user == undefined){
        res.status(401).json({ error : "invalid username or password "})
        return
    }

    let apiKey = jwt.sign( {
        email: user.email,
        id : user.id,
        time: Date.now()
    } , "secret")

    res.json({ apiKey: apiKey })

})

module.exports = routerLogin