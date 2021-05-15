import { io } from 'socket.io-client';

const socket = io('https://c-vivid-backend.herokuapp.com/');
export default socket;