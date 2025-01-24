import { useState } from "react";
import { socket } from "../services/socket"
import axios from "axios";

export const Meeting = () => {
    const [meetingId, setMeetingId] = useState("");
    const [username, setUsername] = useState("");

    socket.on("Answer", (data)=>{
        console.log("inside answer")
        localConnection.setRemoteDescription(data.Answer)
    })

    socket.on("Offer", async (data) => {
        const offerValue = data.offer;
        console.log("Offer recieved: " + offerValue);
        const remoteConnection = new RTCPeerConnection({
            iceServers: [
              {
                urls: "stun:stun.l.google.com:19302",
              },
            ],
          });
        remoteConnection.onicecandidate = (e)=> console.log("New Ice Candidate!! Re-printing SDP: " + JSON.stringify(remoteConnection.localDescription))
        remoteConnection.ondatachannel = (e)=>{
            remoteConnection.dataChannel = e.channel;
            remoteConnection.dataChannel.onmessage = (e)=> console.log("New messaeg from client: " + e.data)
            remoteConnection.dataChannel.onopen = (e)=> console.log("Connection opened!!! ")
        }
        await remoteConnection.remoteDescription(offer);
        console.log("Offer set! ")

        const answer = await remoteConnection.createAnswer()
        await remoteConnection.localDescription(answer)
        console.log("Answer created !! ");

            socket.emit("Answer", {
                Answer : answer
            })
        

    })

    const joinRoom = async () => {
        const token = localStorage.getItem("token");
        console.log(token)
        socket.emit("joinRoom", {
            toJoin: meetingId,
            token: `Bearer ${token}`
        })                                     // also needs to send sdp (to initiate offer)*  => not required as everything is being done here itself

        const localConnection = new RTCPeerConnection({
            iceServers: [
              {
                urls: "stun:stun.l.google.com:19302",
              },
            ],
          })
        const dataChannel = localConnection.createDataChannel("dataChannel")

        dataChannel.onopen = (e) => console.log("Connection opened! ")
        dataChannel.onmessage = (e) => console.log("Got a message:  " + e.data)

        localConnection.onicecandidate = (e) => console.log("new Ice Candidate! Re-printing SDP. " + JSON.stringify(localConnection.localDescription))

        const offer = await localConnection.createOffer()
        await localConnection.setLocalDescription(offer)
        console.log("Offer set successfully! ");

            console.log("being executed.")
            socket.emit("Offer", {
                offer: offer
            })
        
    }

    const createRoom = () => {
        // Room creation call logic
        const token = localStorage.getItem("token")
        console.log(token)
        socket.emit("createRoom", {
            token: `Bearer ${token}`,
        })
        socket.on("onCreated", (data) => {
            console.log(`${data.user} created this room & roomID : ${data.creator}`)
            setUsername(data.user)                              // storing creators username
        })

    }

    return <div>
        <h2>
            Meeting page
        </h2>

        <div>
            <div>
                <label>Join Room </label>
                <input type="text" value={meetingId} placeholder="Enter Room ID" onChange={(e) => setMeetingId(e.target.value)} />
                <button onClick={joinRoom} >Join</button>
            </div>

            <div>
                <label>Create Room</label>
                <button onClick={createRoom}>Create</button>
            </div>
        </div>
    </div>
}

export default Meeting;