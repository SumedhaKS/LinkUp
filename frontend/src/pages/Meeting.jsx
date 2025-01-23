import { useEffect, useState } from "react";
import { socket } from "../services/socket"
import axios from "axios";

export const Meeting = () => {
    const [meetingId, setMeetingId] = useState("");
    const [username, setUsername] = useState("");

    const joinRoom = () => {
        useJoinRoom()

    }

    const useJoinRoom = ()=>{
        const token = localStorage.getItem("token");
        console.log(token)
        socket.emit("joinRoom", {
            toJoin: meetingId,
            token: `Bearer ${token}`
        })                                          // also needs to send sdp (to initiate offer)

        useEffect(async () => {
            const localConnection = new RTCPeerConnection()
            const dataChannel = localConnection.createDataChannel()

            dataChannel.onopen = (e) => console.log("Connection opened! ")
            dataChannel.onmessage = (e) => console.log("Got a message:  " + e.data)

            localConnection.onicecandidate = (e) => console.log("new Ice Candidate! Re-printing SDP. " + JSON.stringify(localConnection.localDescription))

            const offer = await localConnection.createOffer()
            await localConnection.setLocalDescription(offer)
            console.log("Offer set successfully! ")
            socket.to(meetingId).emit("Offer", {
                offer: offer
            })
        }, [])
    }

    const createRoom = () => {
        // Room creation call logic
        const token = localStorage.getItem("token")
        console.log(token)
        socket.emit("createRoom", {
            token: `Bearer ${token}`,
        })
        socket.on("onCreated", (data) => {
            console.log(`${data.user} created this room `)
            setUsername(data.user)                              // storing creators username
        })
        socket.on("Offer", (offer) => {
            const offerValue = offer.offer;

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