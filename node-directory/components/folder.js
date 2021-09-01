// Import System Components
import {join} from 'node:path';
// Export Folder Object
export default class Folder {
    // Initialize Folder Object
    constructor(sD){
        this.sD = sD;
    }
    // Directory Handler if Request is a Directory
    async getFolder(sD = this.sD) {
        // Requesting Folder
        console.log(`============== Directory Requested =============`);
        // Breadcrumbing
        const breadCrumb = await this.getBreadCrumb(sD);
        // Get Directory Listing
        const directoryListing = await this.getView(sD);
        // Render Directory Listing View
        sD.response.writeHead(200, { 'Content-Type': 'text/html' });
        sD.response.write(`
            <!doctype html>
                <head>
                    <title>${sD.request.url}</title>
                    <meta charset="UTF-8"/>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                    <link rel="stylesheet" href="/node-directory/public/styles.css">
                    <script defer src="/node-directory/public/function.js"></script>
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
                        <nav>${breadCrumb}</nav>
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
                                <ul>${directoryListing}</ul>
                        </section>
                        <!-- CUSTOM FOOTER -->
                        <section class="custom-footer">                       
                        </section>
                    </main>
                </body>
            </html>
        `);
        sD.response.end();
    }
    // Get Directory Listing for Current Route
    async getView(sD) {
        // Filter Listing to Ignore Internals and Hidden Files
        sD.list = sD.list.filter(f => !f.match('node-directory'));
        sD.list = sD.list.filter(f => !f.match('index.js'));
        sD.list = sD.list.filter(f => !f.startsWith('.'));
        // Build List String
        let lsStr = Object.keys(sD.list).map(key => (
            `<li>
                <a href="${(sD.request.url == '/')?('/'+sD.list[key]):(sD.request.url+'/'+sD.list[key])}">
                    ${sD.list[key]}
                </a>
            </li>`
        )).join('');
        // Return List String
        return lsStr;
    }
    // Get Breadcrumb for Current Route
    async getBreadCrumb(sD) {
        // Split Current Route by Forward Slash (/)
        let dP = sD.request.url.split('/');
        // Format each item
        let cntr = 0;
        let dA = [];
        dP = dP.map(itm => {
            dA != 0 ? dA[cntr] = join((dA[cntr-1]),itm): dA[cntr] = '/';
            cntr++;
            return dA[cntr-1].replace(/\\/g, "/");
        });
        // Build Breadcrumb with Items
        let breadCrumb = '';
        (sD.request.url == '/')?
        breadCrumb = `<item><a href="/">/</a></item>`:
        breadCrumb = Object.keys(dP).map(key => (`<item><a href="${dP[key]}">${dP[key]}</a></item>`)).join('');
        // Return Breadcrumb String
        return breadCrumb;
    }
}