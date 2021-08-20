//Import Directory Server
import ndir from './ndir/ndir.mjs';

//Create an Instance of Node Directory and Listen for Requests
const server = new ndir(80);

server.listen();