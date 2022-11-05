import {Socket} from "socket.io-client";

export interface ISocket extends Socket {
    name?: string;
    // other additional attributes here, example:
    // surname?: string;
}