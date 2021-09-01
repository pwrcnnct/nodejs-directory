// Import System Components
import {createServer} from 'node:http';
// Import Application Components
import Route from './components/route.js'
import Tree from './components/tree.js'
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
            let route = new Route(req, res);
            route.getData().then(async sD => {

                //Step One: Using Root, Create Tree Object (tree.js component returns global object sd.tree)
                let tree = new Tree(sD);
                sD.tree = await tree.getTree();
                // Request Routing for Folder or for File.
                if (sD.isDirectory) {          

                    //Step Two: Build a Tree Html Object for Navigation Purposes

                    // Render's Directory View
                    let view = new Folder(sD);
                    view.getFolder();
                } else {
                    // Render's File View
                    let view = new File(sD);
                    view.getFile();
                }          
                // Testing 
                //console.log(`Is Directory?: ${  sD.isDirectory}`);
                //console.log(`Method: ${  sD.request.method}`);
                //console.log(`Url: ${  sD.request.url}`);
                //console.log(`Path: ${  sD.pathname}`);
                //console.log(`Root: ${  sD.root}`);
                //console.log(`List: ${  sD.list}\n`);
                console.log(`Tree: ${  JSON.stringify(sD.tree) }\n`);
            })
        });
	}
    // Listen for Requests on Port
    listen(){
        this.app.listen(this.port,() =>{ console.log(`Server Running on port ${this.port}`)});
    }
}