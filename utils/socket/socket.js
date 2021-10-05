import io from 'socket.io-client';

const URL = 'https://chessmyth-server.herokuapp.com/';

const socket = io(URL);

export { socket };
