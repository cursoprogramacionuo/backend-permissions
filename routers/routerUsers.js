const express = require("express")
const routerUsers = express.Router();

let users = require("../data/user")

routerUsers.get("/", (req,res) => {
    res.json(users.map( u => { return { id: u.id, email: u.email} } ))
})

module.exports = routerUsers