let express = require("express")

let app = express();
let port = 8081;

app.use(express.json())

let routerPermissions = require("./routers/routerPermissions")
let routerUsers =  require("./routers/routerUsers")
let routerLogin = require("./routers/routerLogin")

app.use("/permissions",routerPermissions)
app.use("/users",routerUsers)
app.use("/login",routerLogin)

app.listen(port, () => {
    console.log("Servidor activo en "+port)
})