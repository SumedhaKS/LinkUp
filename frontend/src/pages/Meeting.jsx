import { useEffect, useState } from "react";
import { socket } from "../services/socket"
import axios from "axios";

export const Meeting = () => {
    const [meetingId, setMeetingId] = useState("");

    const joinRoom = () => {                                       
        const token = localStorage.getItem("token");
        console.log(token)
        socket.emit("joinRoom", {
            toJoin: meetingId,
            token: `Bearer ${token}`
        })
    }

    const createRoom = () => {
        // Room creation call logic
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