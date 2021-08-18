import { createContext, useContext} from "react";
import { io } from "socket.io-client";



const SocketContext = createContext();

export const SocketContextWrapper = ({children}) => {
    const socket = io("http://localhost:5000");

    return (
        <SocketContext.Provider value = {socket}>
            {children}
        </SocketContext.Provider>
    )
}

export function useSocketContext() {
    return useContext(SocketContext);
}

