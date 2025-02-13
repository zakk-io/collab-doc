const express = require("express")
const mongoose = require("mongoose")
const http = require("http")
const {Server} = require("socket.io")
const path = require("path")
const cookieparser = require("cookie-parser")
const users = require("./routes/users")
const documents = require("./routes/documents")
const {AuthMiddleware} = require("./middlewares")
const { log } = require("console")
require("dotenv").config()
//packages



//settings
const app = express()
const server = http.createServer(app)//create http server and pass express to handle route
mongoose.connect(process.env.MONGO_URI).then(() => console.log('mongodb connected!'));
const io = new Server(server, {
    cors: {
        origin: "http://127.0.0.1:2000",  
        methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE", "PATCH"]
    }
});
//settings



//socket.io
io.on("connection", async (socket) =>{
    socket.on("join_document",document_id => {
        socket.join(document_id)
        
    })

    socket.on("emit_delta",(delta,document_id) => {
        socket.to(document_id).emit("brodcast_delta", delta);
    })
})
//socket.io


//middlewares
app.use(express.json())
app.use(cookieparser())
app.use(express.static(path.join(__dirname, 'public')));
//middlewares


//templates endpoints
app.use(users)
app.get('/register',(req,res) => {
    return res.sendFile(path.join(__dirname, 'public', 'users', 'register.html'))
})

app.get('/login',(req,res) => {
    return res.sendFile(path.join(__dirname,'public',"users","login.html"))
})


app.use(documents)

app.get('/',AuthMiddleware,async (req,res) => {
    return res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.get('/documents',AuthMiddleware,async (req,res) => {
    return res.sendFile(path.join(__dirname, 'public', 'quill.html'))
})

//templates endpoints





server.listen(2000,() => console.log("server listening on port 2000"))