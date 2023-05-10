const express = require("express")
const routerPermissions = express.Router();

let permissions = require("../data/permissions")
let users = require("../data/user")
let authorizers = require("../data/authorizers")

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
    let user =  users.find(
        u => u.email == userEmail && u.password == userPassword )

    if ( user == undefined ){
        return res.status(401).json({ error: "no autorizado "})   
    }


    let errors = []
    if (text == undefined){
        errors.push("no text in the body")
    }
    if ( errors.length > 0 ){
        return res.status(400).json({ erros: errors})
    }

    let lastId = permissions[permissions.length-1].id

    permissions.push({ 
        id: lastId+1, 
        text: text, 
        approbedBy:[], 
        userId: user.id 
    })

    res.json({ id: lastId+1 })
    // 1 { clave: valor}
})

routerPermissions.put("/:id", (req,res) => {
    let permissionId = req.params.id
    if ( permissionId == undefined){
        res.status(400).json({ error: "no id "})
        return
    }
    let permission = permissions.find(p => p.id == permissionId)
    if ( permission == undefined){
        res.status(400).json({ error: "no permission with this id"})
        return
    }
    let text = req.body.text
    if( text != undefined){
        permission.text = text;
    }

    res.json({ modifiyed: true })
})

routerPermissions.put("/:id/approvedBy", (req,res) =>{
    let permissionId = req.params.id
    let authorizerEmail = req.body.authorizerEmail
    let authorizerPassword = req.body.authorizerPassword

    // autent
    let authorizer = authorizers.find(
        a => a.email == authorizerEmail && a.password == authorizerPassword)

    if ( authorizer == undefined){
        return res.status(401).json({ error: "no autorizado"})
    }

    // calidac
    if ( permissionId == undefined){
        return res.status(400).json({ error: "no permissionId"})
    }

    let permission = permissions.find( p => p.id == permissionId)
    permission.approvedBy.push(authorizer.id)

    res.json(permission)
})

module.exports = routerPermissions