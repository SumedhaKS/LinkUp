const express = require("express")
const app = express()
const port = 3001
const cors = require("cors")
const zod = require("zod")

app.use(cors())
app.use(express.json())

const { User } = require('./db/index')
const { jwt, jwtSecret } = require("./config")

app.get('/', (req,res)=>{
    res.json({
        message: "Welcome to LinkUp"
    })
})

const signUpSchema = zod.object({
    username: zod.string().min(6),
    email: zod.string().email(),
    password: zod.string().min(8)
})

app.post('/signup', async (req,res)=>{
    const userBody = signUpSchema.safeParse(req.body)    
    if(!userBody.success){
        return res.status(400).json({
            message : "Invalid inputs"
        })
    }
    else{
        const response = await User.findOne({
                $or: [{username: req.body.username}, {email: req.body.email}]
        })
        console.log({response})
        if(response){
            return res.status(400).json({
                message: "User already exists with same email or username."
            })
        }
        else{
            const response = await User.create({
                username: req.body.username,
                email : req.body.email,
                password : req.body.password
            })
            await response.save()
            return res.status(201).json({
                message: "User created successfully"
            })
        }
    }
})

const signInSchema = zod.object({
    email : zod.string().email(),
    password : zod.string().min(8)
})

app.post('/signin', async (req,res)=>{
    const userBody = signInSchema.safeParse(req.body)
    if(!userBody.success){
        return res.status(400).json({
            message : "Invalid inputs" 
        })
    }
    else{
        const response = await User.findOne({
            email : req.body.email,
            password : req.body.password
        })
        if(!response){
            return res.status(400).json({
                message : "User not found."
            })
        }
        else {
            const token = jwt.sign(response.username, jwtSecret)
            return res.status(200).json({
                message : "Sign in successful",
                token : token
            })
        }
    }
})



app.listen(port, console.log(`Listening on port ${port}` ))