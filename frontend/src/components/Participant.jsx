import { useDeferredValue, useEffect, useReducer, useRef, useState } from "react"
import { socket } from "../services/socket"

export function Participant(name , localAudioTrack, localVideoTrack) {
    const [sendingPC, setSendingPC] = useState(null)
    const [receivingPC, setReceivingPC] = useState(null)
    const [remoteVideoTrack, setRemoteVideoTrack] = useState(null)
    const [remoteAudioTrack, setRemoteAudioTrack] = useState(null)
    const [remoteMediaStream, setRemoteMediaStream] = useState(null)
    const [lobby, setLobby] = useState(true)

    const remoteVideoRef = useRef(null);
    const localVideoRef = useRef(null);

    useEffect(() => {
        socket.on("send-offer", async (roomID) => {
            setLobby(false);
            const pc = new RTCPeerConnection()
            setSendingPC(pc);

            if (localVideoTrack) {
                pc.addTrack(localVideoTrack)
            }
            if (localAudioTrack) {
                pc.addTrack(localAudioTrack)
            }

            pc.onicecandidate = async (e) => {
                if (e.candidate) {
                    socket.emit("add-ice-candidate", {
                        candidate: e.candidate,
                        type: "Sender",
                        roomID
                    })
                }
            }

            pc.onnegotiationneeded = async () => {
                const sdp = await pc.createOffer();
                pc.setLocalDescription(sdp);
                socket.emit("offer", {
                    sdp,
                    roomID
                })
            }
        })

        socket.on("offer", async ({
            sdp: remoteSDP,
            roomID
        }) => {

            setLobby(false);
            const pc = new RTCPeerConnection()
            pc.setRemoteDescription(remoteSDP)
            const sdp = await pc.createAnswer();
            pc.setLocalDescription(sdp);

            const stream = new MediaStream();
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = stream;
            }
            setRemoteMediaStream(stream);

            setReceivingPC(pc);
            window.pcr = pc;
            pc.ontrack = (e) => {
                alert("ontrack")
            }

            pc.onicecandidate = async (e) => {
                if (!e.candidate) {
                    return
                }
                if (e.candidate) {
                    socket.emit("add-ice-candidate", {
                        candidate: e.candidate,
                        type: "receiver",
                        roomID
                    })
                }
            }

            socket.emit("answer", {
                roomID,
                sdp: sdp
            });

            setTimeout(() => {
                const track1 = pc.getTransceivers()[0].receiver.track;
                const track2 = pc.getTransceivers()[1].receiver.track;
                if (track1.kind === "video") {
                    setRemoteAudioTrack(track2);
                    setRemoteVideoTrack(track1);
                }
                else {
                    setRemoteAudioTrack(track1);
                    setRemoteVideoTrack(track2);
                }
                remoteVideoRef.current.srcObject.addTrack(track1);
                remoteVideoRef.current.srcObject.addTrack(track2);
                remoteVideoRef.current.play()

            }, 3000)

            socket.on("answer", ({ roomID, sdp: remoteSDP }) => {
                setLobby(false);
                setSendingPC(pc => {
                    pc?.setRemoteDescription(remoteSDP)
                    return pc;
                })
                console.log("loop closed")
            })

            socket.on("lobby", () => {
                setLobby(true)
            })

            socket.on("add-ice-candidate", ({
                candidate,
                type
            })=>{
                console.log("add ice from remote")
                if(type == "sender"){
                    setReceivingPC(pc =>{
                        if(!pc){
                            console.error("receivig pc not found")
                        }
                        else{
                            console.error(pc.ontrack)
                        }
                        pc?.addIceCandidate(candidate)
                        return pc
                    })
                }
                else{
                    setSendingPC(pc=>{
                        if(!pc){
                            console.error("receiving pc not found")
                        }
                        pc?.addIceCandidate(candidate)
                        return pc
                    })
                }
            })
        })
    }, [name])

    useEffect(() => {
        if (localVideoRef.current) {
            if (localVideoTrack) {
                localVideoRef.current.srcObject = new MediaStream([localVideoTrack])
                localVideoRef.current.play()
            }
        }
    }, [localVideoRef])

    return <div>
        Participant

        <div>
            <video autoPlay width={400} height={400} ref={localVideoRef}></video>
            <video autoPlay width={400} height={400} ref={remoteVideoRef}></video>
        </div>
    </div>
}
