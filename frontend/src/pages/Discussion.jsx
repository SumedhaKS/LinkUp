import { useEffect, useRef, useState } from "react"
import { Participant } from "../components/Participant"

export default function Discussion() {
    const [joined, setJoined] = useState(false);
    const [localAudioTrack, setLocalAudioTrack] = useState(null);
    const [localVideoTrack, setLocalVideoTrack] = useState(null);
    const [name, setName] = useState("")
    const videoRef = useRef(null);
    
    const getCam = async ()=>{
        const stream = await window.navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        })
        const audioTrack = stream.getAudioTracks()[0]
        const videoTrack = stream.getVideoTracks()[0]
        setLocalAudioTrack(audioTrack)
        setLocalVideoTrack(videoTrack)

        if(!videoRef.current){
            return;
        }
        videoRef.current.srcObject = new MediaStream([videoTrack])
        await videoRef.current.play();
    }

    useEffect(()=>{
        if(videoRef && videoRef.current){
            getCam()
        }
    }, [videoRef])


    if (!joined) {
        return <div>
            Discussion Page

            <div >
                <input type="text" value={name} onChange={(e)=>setName(e.target.value)} />
                <video autoPlay ref={videoRef}></video>
                <button onClick={()=>setJoined(true)}>Join</button>

            </div>
        </div>

    }

    return <Participant name={name} localAudioTrack={localAudioTrack} localVideoTrack={localVideoTrack} />

}