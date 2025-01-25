const mongoose = require("mongoose")

mongoose.connect("")  //put your mongoose connection url

const UserSchema = new mongoose.Schema({
    username:{type: String, required:true} ,
    email:{type: String, required:true },
    password:{type: String, required:true},
})

const RoomSchema = new mongoose.Schema({
    creator : {type: String, required: true },
    createdAt: {type: Date, default: Date.now()}
})

const User = mongoose.model('User', UserSchema)
const Room = mongoose.model('Room', RoomSchema)

module.exports = {
    User , 
    Room
}