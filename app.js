let express = require("express")

let app = express();
let port = 8081;

app.use(express.json())

let routerPermissions = require("./routers/routerPermissions")
let reouterUsers =  require("./routers/routerUsers")

app.use("/permissions",routerPermissions)
app.use("/users",reouterUsers)

app.listen(port, () => {
    console.log("Servidor activo en "+port)
})