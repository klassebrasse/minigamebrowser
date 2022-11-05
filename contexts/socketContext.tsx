import React, {createContext, useContext, useEffect, useState} from "react";
import {io} from "socket.io-client";
import {ISocket} from "../types/ISocket";


const socket = io("http://192.168.1.107:8001", { transports : ['websocket'], upgrade: false });
const SocketContext = createContext(socket);

export function useSocket() {
    return useContext(SocketContext);
}

export function SocketProvider({ children }: any) {
    //Add ISocket, store user data
    const [currentSocket, setCurrentSocket] = useState<ISocket>(null);
    useEffect(() => {
        setCurrentSocket(io("http://192.168.1.107:8001", { transports : ['websocket'], upgrade: false, forceNew: false}))

        return () => setCurrentSocket(null)
    }, [])

    return (
        <SocketContext.Provider value={currentSocket}>
            { currentSocket && children}
        </SocketContext.Provider>
    )
}
