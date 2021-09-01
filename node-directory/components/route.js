// Import System Components
import {stat, readdir} from 'node:fs/promises';
import {dirname, normalize, join} from 'node:path';
import {fileURLToPath} from 'url';
// Directory Name
const __dirname = dirname(fileURLToPath(import.meta.url));
// Route Data Model
export default class Route {
    // Building Server Data
    constructor(req, res) {
        this.req = req;
        this.res = res;
    }
    // Returns a Server Data Object
    async getData(req = this.req, res = this.res){
        //Server Data Object
        let pathname = await this.getPathname(req.url);
        let root = pathname.replace(req.url.replace(/\//g, '\\'), '');
        let list = await this.isPathDirectory(pathname)?await this.readDirectory(pathname):'';
        let isDirectory = await this.isPathDirectory(pathname);
        return {
            'request': req,
            'response': res,
            'pathname': pathname,
            'root': root,
            'list': list,
            'isDirectory': isDirectory           
        }
    }
    // Path Sanitization
    async getPathname(pth) {
        let sanitizedPth = normalize(pth).replace(/^(\.\.[\/\\])+/, '');
        let pathname = join(__dirname, sanitizedPth);
        pathname = pathname.replace(`node-directory\\components\\`, '');
        return pathname;
    }
    // Directory or File Switch Function.
    async isPathDirectory(pth) {
        let flag = Boolean;    
        ((await stat(pth)).isDirectory())?
                flag = true:
                flag = false;
        return flag;
    }
    // Read Directory
    async readDirectory(pth) {
        return await readdir(pth);
    }
}