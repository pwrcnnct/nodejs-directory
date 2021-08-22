//Import System Components
import {readFile} from 'node:fs/promises';
import {parse} from 'node:path';

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

export default class File {
    async getFile(sD){
        // Requesting File
        console.log(`================ File Requested ================`);
        // read file from file system
        await readFile(sD.pathname)
        .then(data => {
            // based on the URL path, extract the file extention. e.g. .js, .doc, ...
            const ext = parse(sD.pathname).ext;
            // if the file is found, set Content-type and send data
            sD.response.setHeader('Content-type', mimeType[ext] || 'text/plain');
            sD.response.end(data);
        });
    }
}