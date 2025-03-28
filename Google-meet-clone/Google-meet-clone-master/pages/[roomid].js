import { useSocket } from "@/context/socket";
import usePeer from "@/hooks/usePeer";
import { useEffect } from "react";
import useMediaStream from "@/hooks/useMediaStream";

import Player from '@/component/Player';

const Room =()=>{
const  socket  = useSocket();

const {peer, myId} =usePeer();
const {stream} =useMediaStream()

useEffect(()=>{
    if(!socket || !peer || !socket) return;
    const handleUserConnected=(newUser)=>{
        console.log(`user cennected in room ${newUser}`)

        const call =  peer.call(newUser, stream)
        call.on('stream',(incomingStream)=>{
            console.log(`incoming stream from someone ${newUser}`)
        })


    }
socket.on('user-connected',handleUserConnected)

return () => {
    socket.off('user-connected', handleUserConnected)
}

},[peer,socket,stream])


//listening the call
useEffect(()=>{
    if(!peer||!stream) return;
    peer.on('call',(call)=>{
        const {peer:callerId}=call;
        call.answer(stream)

        call.on('stream',(incomingStream)=>{
            console.log(`incoming stream from someone ${callerId}`)
        })
    })

},[])

return (
    <div>
       <Player url={stream} muted playing playerId={myId}/>
    </div>
)
};

export default Room;