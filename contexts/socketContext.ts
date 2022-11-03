import React, {createContext} from "react";
import {io} from "socket.io-client";

export const socket = io("http://192.168.1.107:8001", { transports : ['websocket'], upgrade: false });
export const SocketContext = React.createContext(null);