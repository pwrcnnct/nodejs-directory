//Import Directory Server
import nodeDirectory from './node-directory/main.mjs';

//Create an Instance of Node Directory
const server = new nodeDirectory(80);

//Listen for Requests
server.listen();