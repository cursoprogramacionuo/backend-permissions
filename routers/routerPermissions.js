const express = require("express")
const routerPermissions = express.Router();
let jwt = require("jsonwebtoken")

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
        userId: req.infoApiKey.id 
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
    let permission = permissions.find(
        p => p.id == permissionId && p.userId == req.infoApiKey.id )

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

    let user = users.find(u => u.id == req.infoApiKey.id)
    if (user.role != "admin"){
        res.status(401).json({ error: "user is not an admin"})
        return
    }


    let permissionId = req.params.id

    // calidac
    if ( permissionId == undefined){
        return res.status(400).json({ error: "no permissionId"})
    }

    let permission = permissions.find( p => p.id == permissionId)
    permission.approvedBy.push(req.infoApiKey.id)

    res.json(permission)
})

routerPermissions.delete("/:id", (req,res) => {
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
    let user = users.find( u => u.id == req.infoApiKey.id)
    if ( user.role == "user" && permission.userId != req.infoApiKey.id){
        res.status(401).json({ error: "is not your permission"})
        return
    }

    permissions = permissions.filter( p => p.id != permissionId)

    res.json({ deleted: true })
})

module.exports = routerPermissions