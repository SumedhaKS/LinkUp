const express = require("express")
const app = express()
const port = 3001
const cors = require("cors")
const zod = require("zod")

const { User } = require('./db/index')
const { jwt, jwtSecret } = require("./config")

const http = require("http")
const { Server } = require("socket.io") 

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});


app.use(cors())
app.use(express.json())

io.on("connection", (socket) => {
    console.log("User connected: ", socket.id);

    socket.on("joinRoom", async (data)=>{
        console.log(data)
        const token = data.token.split(" ")[1]
        const verifiedUser = jwt.verify(token, jwtSecret)
        if(!verifiedUser){
            return socket.emit("error", {
                message : "User not found"
            })
        }
        else{
            
        }
    })

    socket.on("Offer", (data)=>{
        console.log(data.offer)
    })

    socket.on("createRoom", async (data)=>{
        console.log(data)
        const token = data.token.split(" ")[1];
        const verifiedUser = jwt.verify(token, jwtSecret)
        if(!verifiedUser){
            return socket.emit("error", {
                message : "User not found"
            })
        }

        else{
            const response = await User.findById({_id: verifiedUser.id})
            socket.join(verifiedUser.id)
            io.to(verifiedUser.id).emit("onCreated", {              // just to convey who is the creator of the room
                user : response.username
            })
        }
    })

    socket.on("disconnect", ()=>{
        console.log("User disconnected: ", socket.id)
    })
})


app.get('/', (req, res) => {
    res.json({
        message: "Welcome to LinkUp"
    })
})

const signUpSchema = zod.object({
    username: zod.string().min(6),
    email: zod.string().email(),
    password: zod.string().min(8)
})

app.post('/signup', async (req, res) => {
    const userBody = signUpSchema.safeParse(req.body)
    if (!userBody.success) {
        return res.status(400).json({
            message: "Invalid inputs"
        })
    }
    else {
        const response = await User.findOne({
            $or: [{ username: req.body.username }, { email: req.body.email }]
        })
        console.log({ response })
        if (response) {
            return res.status(409).json({
                message: "User already exists with same email or username."
            })
        }
        else {
            const response = await User.create({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            })
            await response.save()
            return res.status(201).json({
                message: "User created successfully"
            })
        }
    }
})

const signInSchema = zod.object({
    email: zod.string().email(),
    password: zod.string().min(8)
})

app.post('/signin', async (req, res) => {
    const userBody = signInSchema.safeParse(req.body)
    if (!userBody.success) {
        return res.status(400).json({
            message: "Invalid inputs"
        })
    }
    else {
        const response = await User.findOne({
            email: req.body.email,
            password: req.body.password
        })
        if (!response) {
            return res.status(404).json({
                message: "User not found."
            })
        }
        else {
            const token = jwt.sign({ id : response._id }, jwtSecret)
            return res.status(200).json({
                message: "Sign in successful",
                token: token
            })
        }
    }
})



httpServer.listen(port, console.log(`Listening on port ${port}`))