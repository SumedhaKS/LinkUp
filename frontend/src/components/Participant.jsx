import { useEffect, useRef } from "react"
import { socket } from "../services/socket"

export function Participant(localAudioTrack, localVideoTrack) {
    
    // const localVideoRef = useRef()

    



    // useEffect(()=>{
    //     if(localVideoRef.current){
    //         if(localVideoTrack){
    //             localVideoRef.current.srcObject = new MediaStream([localVideoTrack])
    //             localVideoRef.current.play()
    //         }
    //     }
    // }, [localVideoRef])


    return <div>
        Participant

        <div>
            {/* <video autoPlay ref={localVideoRef}></video> */}
        </div>
    </div>
}
