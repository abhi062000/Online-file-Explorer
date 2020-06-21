// required module
const https = require('https');

// JSON file for mime type
let mimeURL = 'https://gist.githubusercontent.com/AshHeskes/6038140/raw/27c8b1e28ce4c3aff0c0d8d3d7dbcb099a22c889/file-extension-to-mime-types.json';

const getMimeType = extension => {
    return new Promise((resolve, reject) => {

        https.get(mimeURL, (response) => {
            if (response.statusCode < 200 || response.statusCode > 299) {
                reject(`Failed to laod mime type JSON file ${response.statusCode}`);
                console.log(`Failed to laod mime type JSON file ${response.statusCode}`);
                return false;
            }

            let data = '';
            // received data by chunk
            response.on('data', chunk => {
                data += chunk;
            })

            // once received an data chunk get mime type
            response.on('end', () => {
                resolve(JSON.parse(data)[extension]);
            })

        }).on('error', (e) => {
            console.error(e);
        });
    })
}
module.exports = getMimeType;