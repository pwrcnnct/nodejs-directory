//Import System Components
import {stat, readdir} from 'node:fs/promises';
import {createServer} from 'node:http';
import {fileURLToPath} from 'url';
import {dirname, normalize, join} from 'node:path';

//Import Application Components
import Folder from './components/folder.js';
import File from './components/file.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

//Export Directory Server
export default class Server {
	constructor(port, server) {
		this.port = port || 1337;
		this.app = createServer(async (req, res) => {         
            //Server Data Object
            let pathname = await getPathname(req.url);
            let root = pathname.replace(req.url.replace(/\//g, '\\'), '');
            let serverData = {
                'request': req,
                'response': res,
                'pathname': pathname,
                'root': root,
                'list': await isPathDirectory(pathname)?await readDirectory(pathname):'',
                'isDirectory': await isPathDirectory(pathname)
            }

            //Request Routing for Folder or for File.
            serverData.isDirectory?
            
            //Render's Directory View
            await new Folder().getFolder(serverData):
            
            //Render's File View
            await new File().getFile(serverData);

            //Testing 
            testingLog(serverData);
        });
	}
    listen(){
        this.app.listen(this.port,() =>{ console.log(`Server Running on port ${this.port}`);});
    }
}

//Path Sanitization
const getPathname  = async (pth) => {
    let sanitizedPth = normalize(pth).replace(/^(\.\.[\/\\])+/, '');
    let pathname = join(__dirname, sanitizedPth);
    return pathname.replace(`node-directory\\`, '');
}

// Directory or File Switch Function.
const isPathDirectory = async (pth) => {
    let flag = Boolean;    
    ((await stat(pth)).isDirectory())?
            flag = true:
            flag = false;
    return flag;
}

//Read Directory
const readDirectory = async (pth) => {
    return await readdir(pth);
}

//Testing Console.
const testingLog = async (sD) => console.log(`
Method: ${  await sD.request.method} 
Request: ${  await sD.request.url} 
Path: ${  await sD.pathname} 
Root: ${  await sD.root} 
List: ${  await sD.list}
Is Directory?: ${  await sD.isDirectory}`
);