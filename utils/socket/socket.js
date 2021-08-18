import io from "socket.io-client";

const URL = "https://eikichess-server.herokuapp.com/";

const socket = io(URL);

export {
    socket
}