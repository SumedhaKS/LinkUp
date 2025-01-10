const express = require("express")
const app = express()
const port = 3001
const cors = require("cors")

app.use(cors())
app.use(express.json())

app.get('/', (req,res)=>{
    res.json({
        message: "Welcome to LinkUp"
    })
})

app.listen(port, console.log(`Listening on port ${port}` ))