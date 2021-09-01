import { resolve, join } from 'path';
import { readdir, stat } from 'fs/promises';

export default class Tree {
    // Building Server Data
    constructor(sD) {
        this.sD = sD;
    }

    async getTree(sD = this.sD){
        let tree = await this.buildTree();
        let test = await this.treeView(tree);
        console.log(test);
        return tree;
    }

    // Display Tree Listing for Root
    async treeView(tree) {

        return tree;
    }

    async buildTree (dir = './', allFiles = {}, counter = 0) {
        let files = (await readdir(dir)).map(f => join(dir, f))
        files = files.filter(f => !f.startsWith('.'))
        files = files.filter(f => !f.match('node-directory'))
        allFiles[dir] = [];
        await Promise.all(files.map(async f => (
            ((await stat(f)).isDirectory())?
                allFiles[dir].push(f) && this.buildTree(f, allFiles, counter):
                ''
        )))
        delete allFiles['./'];
        return allFiles;
    }

}