// imports
let url = require('url');
let path = require('path');
let fs = require('fs');
let buildBreadcrumb = require('./breadcrumb.js');
let mainContent = require('./maincontent.js');
let getMimeType = require('./getMimeType.js');

// location of static folder
const staticBasePath = path.join(__dirname, '..', 'static');
console.log("Static Base Path" + staticBasePath);
const respond = (request, response) => {

    // getting pathname
    let pathname = url.parse(request.url, true).pathname;

    if (pathname === '/favicon.ico') {
        return false;
    }

    // decoding pathname
    console.log(pathname);
    pathname = decodeURIComponent(pathname);
    console.log(pathname);

    const fullStaticPath = path.join(staticBasePath, pathname);
    console.log(fullStaticPath);

    // path exist or not
    if (!fs.existsSync(fullStaticPath)) {
        response.write("404: Not found");
        response.end();
        return false;
    }

    // get status and whether it is file or directory
    let stats;
    try {
        stats = fs.lstatSync(fullStaticPath);
    } catch (err) {
        console.log(`${err}`);
    }


    if (stats.isDirectory()) {
        // get contents from html template
        let data = fs.readFileSync(path.join(staticBasePath, '/code/index.html'), "utf-8");

        // building page title
        // console.log(pathname);
        let pathElements = pathname.split('/').reverse();
        pathElements = pathElements.filter(element => element !== '');
        console.log(pathElements);
        let folderName = pathElements[0];
        if (folderName == undefined) {
            folderName = "Home";
        }
        console.log(`foldername ${folderName}`);
        data = data.replace('Page_title', folderName);

        // breadcrumb
        let breadcrumb = buildBreadcrumb(pathname);
        data = data.replace('pathname', breadcrumb);

        // table content
        let maincontent = mainContent(fullStaticPath, pathname);
        data = data.replace('maincontent', maincontent);

        response.statusCode = 200;
        response.write(data);
        return response.end();

    }

    // not a file
    if (!stats.isFile()) {
        response.statusCode = 401;
        response.write("Access Denied");
        console.log("File not found");
        return response.end();
    }

    // It is file - getting file extension
    let fileDetails = {};
    fileDetails.extname = path.extname(fullStaticPath);
    console.log(fileDetails.extname);

    //file size
    let stat;
    try {
        stat = fs.statSync(fullStaticPath);
    } catch (err) {
        console.log(`error: ${err}`);
    }
    fileDetails.size = stat.size;


    // getting mime type
    getMimeType(fileDetails.extname)
        .then(mime => {
            let head = {};
            let options = {};

            let responseStatusCode = 200;
            head['Content-Type'] = mime;

            // pdf file
            if (fileDetails.extname == 'pdf') {
                head['Content-Deposition'] = 'inline';
                // head['Content-Disposition'] = 'attachment;filename=file.pdf'; -> for download
            }

            //audio/video file? -> stream in ranges
            if (RegExp('audio').test(mime) || RegExp('video').test(mime)) {
                //header
                head['Accept-Ranges'] = 'bytes';

                const range = request.headers.range;
                console.log(`range: ${range}`);
                if (range) {
                    //bytes=5210112-end
                    //5210112-end
                    //[5210112,end]
                    const start_end = range.replace(/bytes=/, "").split('-');
                    const start = parseInt(start_end[0]);
                    const end = start_end[1] ?
                        parseInt(start_end[1]) :
                        fileDetails.size - 1;
                    //0 ... last byte

                    //headers
                    //Content-Range
                    head['Content-Range'] = `bytes ${start}-${end}/${fileDetails.size}`;
                    //Content-Length
                    head['Content-Length'] = end - start + 1;
                    statusCode = 206;

                    //options
                    options = {
                        start,
                        end
                    };
                }

            }

            // streaming method for reading file
            const fileStream = fs.createReadStream(fullStaticPath, options);

            // stream chunks to your response object
            fileStream.pipe(response);

            // events : close and error
            fileStream.on('close', () => {
                return response.end();
            });

            fileStream.on('error', error => {
                console.log(error.code);
                response.statusCode = 404;
                response.write('404 :Filestream error!');
                return response.end();
            })

        })
        .catch(err => {
            response.statusCode = 500;
            response.write("Internal server Error");
            console.log(err);
            return response.end();
        })




}
module.exports = respond;