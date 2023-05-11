let express = require("express")
let jwt = require("jsonwebtoken")

let app = express();
let port = 8081;

app.use(express.json())

app.use(["/permissions"], (req,res,next) => {
    console.log("middleware execution")
    
    let apiKey = req.query.apiKey
    if ( apiKey == undefined){
        res.status(401).json({ error : "apiKey required"})
        return
    }

    let infoApiKey = null
    try {
        infoApiKey = jwt.verify(apiKey,"secret")
    } catch ( error){
        res.status(401).json({ error: "invalid token "})
        return
    }

    req.infoApiKey = infoApiKey
    next()
})


let routerPermissions = require("./routers/routerPermissions")
let routerUsers =  require("./routers/routerUsers")
let routerLogin = require("./routers/routerLogin")

app.use("/permissions",routerPermissions)
app.use("/users",routerUsers)
app.use("/login",routerLogin)

app.listen(port, () => {
    console.log("Servidor activo en "+port)
})