import fs from 'node:fs/promises';
import http from 'node:http';
import URL from 'url';
import path from 'node:path';

const port = process.env.port || 80;
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

const testingLog = async (req) => {
    const pathname = await sanitization(req);
    console.log(`
Method: ${req.method}
Url: ${req.url}
Pathname: ${pathname}
    `);
}

const sanitization = async (req) => {
    // extract URL path
    let sanitizePath = path.normalize(req.url).replace(/^(\.\.[\/\\])+/, '');
    let pathname = path.join(__dirname, sanitizePath);
    return pathname.replace(`ndir\\`, '');
}

const isPathDirectory = async (pathname) => {
    let flag = Boolean;    
    ((await fs.stat(pathname)).isDirectory())?
            flag = true:
            flag = false;
    return flag;
}

const fileHandler = async (req, res) => {

    const pathname = await sanitization(req);

    // Requesting File
    console.log(`<=Requesting File...`);

    // read file from file system
    await fs.readFile(pathname)
    .then(data => {
        // based on the URL path, extract the file extention. e.g. .js, .doc, ...
        const ext = path.parse(pathname).ext;
        // if the file is found, set Content-type and send data
        res.setHeader('Content-type', mimeType[ext] || 'text/plain' );
        res.end(data);
        return;
    })
    .catch(err => {
        res.statusCode = 500;
        console.error(err);
        res.end(`Error getting the file: ${err}.`);
        return;
    });
}

const folderHandler = async (req, res) => {

    const pathname = await sanitization(req);

    //Requesting File
    console.log(`<=Requesting Folder...`);
    // folder control
    let dirPath = req.url.split('/');
    let counter = 0, dirArr = [];
    dirPath = dirPath.map(item => {
        dirArr != 0 ?
        dirArr[counter] = path.join((dirArr[counter-1]),item):
        dirArr[counter] = '/';
        counter++;
        return dirArr[counter-1].replace(/\\/g, "/");
    })
    await fs.readdir(pathname)
    .then (data => {
        let list = data.filter(f => !f.match('ndir'));
        list = list.filter(f => !f.startsWith('.'));
        console.log(list)
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(`
            <!doctype html>
                <head>
                    <title>${req.url}</title>
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
                            ${(req.url == '/')?
                                `<item><a href="/">/</a></item>`:
                                Object.keys(dirPath).map(key => (
                                `<item><a href="${dirPath[key]}">${dirPath[key]}</a></item>`
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
                                        <a href="${(req.url == '/')?('/'+list[key]):(req.url+'/'+list[key])}">
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
        res.end();
        return;
    })
    .catch(err => {
        res.statusCode = 500;
        console.error(err);
        res.end(`Error getting the folder: ${err}.`);
        return;
    })
}

const server = http.createServer(async (req, res) => {

    testingLog(req);

    const isDirectory = await isPathDirectory(await sanitization(req));
    if (isDirectory) {
        folderHandler(req, res);
    } else {
        fileHandler(req, res);
    }
});

//Export Directory Server
export default server.listen(port, () => console.log(`Server Running on port ${port}`) );