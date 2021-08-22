// Import System Components
import {createServer} from 'node:http';
// Import Application Components
import Route from './components/route.js'
import Folder from './components/folder.js';
import File from './components/file.js';
// Export Directory Server
export default class Server {
    // Application Server Initialization
	constructor(port) {
		this.port = port || 1337;
		// Directory Server
        this.app = createServer(async (req, res) => {         
            // Gather Route Details
            new Route(res, req)
            .then(async sD => {
                // Request Routing for Folder or for File.
                sD.isDirectory?          
                // Render's Directory View
                new Folder(sD):          
                // Render's File View
                new File(sD);
                // Testing 
                console.log(`Is Directory?: ${  await sD.isDirectory}`);
                console.log(`Method: ${  await sD.request.method}`);
                console.log(`Url: ${  await sD.request.url}`);
                console.log(`Path: ${  await sD.pathname}`);
                console.log(`Root: ${  await sD.root}`);
                console.log(`List: ${  await sD.list}`);
            })
        });
	}
    // Listen for Requests on Port
    listen(){
        this.app.listen(this.port,() =>{ console.log(`Server Running on port ${this.port}`)});
    }
}