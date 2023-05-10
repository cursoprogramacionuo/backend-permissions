const express = require("express")
const routerPermissions = express.Router();

let permissions = require("../data/permissions")
let users = require("../data/user")

routerPermissions.get("/", (req,res) => {
    let text = req.query.text
    if ( text != undefined){
        let permissionsWithText = permissions.filter(p => p.text.includes(text))
        res.json(permissionsWithText)
        return
    }
    res.json(permissions)
})

routerPermissions.get("/:id", (req,res) => {
    let id = req.params.id
    if ( id == undefined){
        res.status(400).json({ error: "no id"})
        return 
    }
    let permission = permissions.find( p => p.id == id )
    if ( permission == undefined){
        res.status(400).json({ error: "invalid id"})
        return
    }

    res.json(permission)
})

routerPermissions.post("/", (req, res) => {
    let text = req.body.text
    let userEmail = req.body.userEmail
    let userPassword = req.body.userPassword

    // validación
    let listUsers =  users.filter(
        u => u.email == userEmail && u.password == userPassword )

    if ( listUsers.length == 0 ){
        return res.status(401).json({ error: "no autorizado "})   
    }


    let errors = []
    if (text == undefined){
        errors.push("no text in the body")
    }
    if ( userId == undefined){
        errors.push("no userId in the body")
    }
    if ( errors.length > 0 ){
        return res.status(400).json({ erros: errors})
    }

    let lastId = permissions[permissions.length-1].id

    permissions.push({ 
        id: lastId+1, 
        text: text, 
        approbedBy:[], 
        userId: listUsers[0].id 
    })

    res.json({ id: lastId+1 })
    // 1 { clave: valor}
})


module.exports = routerPermissions