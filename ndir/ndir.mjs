//Imports and Global Variables
import fs from 'node:fs/promises';
import http from 'node:http';
import URL from 'url';
import path from 'node:path';

const __dirname = path.dirname(URL.fileURLToPath(import.meta.url));
const mimeType = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.md': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.zip': 'application/zip',
    '.doc': 'application/msword',
    '.eot': 'application/vnd.ms-fontobject',
    '.ttf': 'application/x-font-ttf'
};

//Export Directory Server
export default class Server {
	constructor(port, server) {
		this.port = port || 1337;
		this.app = http.createServer(async (req, res) => {         
            //Server Data Object
            let serverData = {
                'request': req,
                'response': res,
                'pathname': await getPathname(req.url)
            }
            
            //Testing 
            testingLog(serverData);
        
            //Request Routing for Folder or for File.
            (await isPathDirectory(serverData.pathname))?
            
            //Render's Directory View
            folderHandler(serverData):
            
            //Render's File View
            fileHandler(serverData);
        });
	}
    listen(){
        this.app.listen(this.port,() =>{ console.log(`Server Running on port ${this.port}`);});
    }
}

//Path Sanitization
const getPathname  = async (pathUrl) => {
    let sanitizePath = path.normalize(pathUrl).replace(/^(\.\.[\/\\])+/, '');
    let pathname = path.join(__dirname, sanitizePath);
    return pathname.replace(`ndir\\`, '');
}

//Testing Console.
const testingLog = async (sD) => console.log(`
MTD: ${sD.request.method}
URL: ${sD.request.url}
PTH: ${sD.pathname}`
);

//Directory or File Switch Function.
const isPathDirectory = async (pathname) => {
    let flag = Boolean;    
    ((await fs.stat(pathname)).isDirectory())?
            flag = true:
            flag = false;
    return flag;
}

//File Handler if Request is a File
const fileHandler = async (serverData) => {
    //Requesting File
    console.log(`================ File Requested ================`);
    // read file from file system
    await fs.readFile(serverData.pathname)
    .then(data => {
        // based on the URL path, extract the file extention. e.g. .js, .doc, ...
        const ext = path.parse(serverData.pathname).ext;
        // if the file is found, set Content-type and send data
        serverData.response.setHeader('Content-type', mimeType[ext] || 'text/plain' );
        serverData.response.end(data);
        return;
    })
    .catch(err => {
        serverData.response.statusCode = 500;
        console.error(err);
        serverData.response.end(`Error getting the file: ${err}.`);
        return;
    });
}

//Directory Handler if Request is a Directory
const folderHandler = async (serverData) => {
    //Requesting Folder
    console.log(`============== Directory Requested =============`);
    // Folder control
    let dP = serverData.request.url.split('/'),cntr = 0, dA = [];
    dP = dP.map(itm => {
        dA != 0 ? dA[cntr] = path.join((dA[cntr-1]),itm): dA[cntr] = '/';
        cntr++;
        return dA[cntr-1].replace(/\\/g, "/");
    });
    await fs.readdir(serverData.pathname)
    .then (data => {
        let list = data.filter(f => !f.match('ndir'));
        list = list.filter(f => !f.startsWith('.'));
        serverData.response.writeHead(200, { 'Content-Type': 'text/html' });
        serverData.response.write(`
            <!doctype html>
                <head>
                    <title>${serverData.request.url}</title>
                    <meta charset="UTF-8"/>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                    <meta name="description" content="Free Web tutorials">
                    <meta name="keywords" content="${list}">
                    <meta name="author" content="Josh Duplisea">
                    <style>
                        body {

                        }
                        header {

                        }
                        .settings {

                        }
                        .search {

                        }
                        nav {
                            padding: 10px 16px;
                            background-color: #eee;
                            display: inline;
                            font-size: 18px;
                        }
                            nav item+item:before {
                                padding: 8px;
                                color: black;
                                content: "\\203A";
                            }
                            nav a {
                                color: #0275d8;
                                text-decoration: none;
                            }
                            nav a:hover {
                                color: #01447e;
                                text-decoration: underline;
                            }
                        aside {

                        }
                        main {

                        }
                        .custom-header {

                        }
                        .directory-listing {

                        }
                        .custom-footer {

                        }
                    </style>
                </head>
                <body>

                    <!-- HEADER -->
                    <header>
                        <!-- SETTINGS -->
                        <section class="settings">
                    
                        </section>

                        <!-- SEARCH -->
                        <section class="search">
                        
                        </section>

                        <!-- BREADCRUMB -->
                        <nav>
                            ${(serverData.request.url == '/')?
                                `<item><a href="/">/</a></item>`:
                                Object.keys(dP).map(key => (
                                `<item><a href="${dP[key]}">${dP[key]}</a></item>`
                            )).join('')}
                        </nav>
                    </header>

                    <!-- TREE VIEW -->
                    <aside>
                        <!-- Todo Create Tree Struct -->
                    </aside>
                    
                    <!-- MAIN -->
                    <main>

                        <!-- CUSTOM HEADER -->
                        <section class="custom-header">
                        
                        </section>

                        <!-- LISTING -->
                        <section class="directory-listing">
                                <ul>${Object.keys(list).map(key => (
                                    `<li>
                                        <a href="${(serverData.request.url == '/')?
                                            ('/'+list[key]):
                                            (serverData.request.url+'/'+list[key])}">
                                            ${list[key]}
                                        </a>
                                    </li>`
                                )).join('')}</ul>
                        </section>

                        <!-- CUSTOM FOOTER -->
                        <section class="custom-footer">
                        
                        </section>
                    </main>
                </body>
            </html>
        `);
        serverData.response.end();
        return;
    })
    .catch(err => {
        serverData.response.statusCode = 500;
        console.error(err);
        serverData.response.end(`Error getting the folder: ${err}.`);
        return;
    })
}