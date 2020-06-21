let fs = require('fs');
let path = require('path');

// files
let calculateSizeD = require('./calculateSizeD.js')
let calculateSizeF = require('./calculateSizeF.js')

let mainContent = (fullStaticPath, pathname) => {
    let maincontent = '';
    let items;
    try {
        items = fs.readdirSync(fullStaticPath);
        console.log(items);
    } catch (err) {
        console.log(err);
        return `<div class="alert alert-danger">Internal Server Error</div>`
    }

    // hide code folder as it is source code 
    if (pathname == '/') {
        items = items.filter(element => element !== 'code');
    }

    // looping through all folder items
    items.forEach(item => {
        // link
        const link = path.join(pathname, item);

        // icon
        // getting status
        let itemDetails = {} //empty object for icon ,stats and size

        let itemFullStaticPath = path.join(fullStaticPath, item);
        try {
            itemDetails.stats = fs.statSync(itemFullStaticPath);
        } catch (err) {
            console.log(`${err}`);
        }


        if (itemDetails.stats.isDirectory()) {
            itemDetails.icon = `<ion-icon name="folder"></ion-icon>`;
            [itemDetails.size, itemDetails.sizeBytes] = calculateSizeD(itemFullStaticPath);
        } else if (itemDetails.stats.isFile()) {
            itemDetails.icon = `<ion-icon name="document"></ion-icon>`;
            [itemDetails.size, itemDetails.sizeBytes] = calculateSizeF(itemDetails.stats);
        }

        // last modified time(unix timestamp)
        itemDetails.timeStamp = itemDetails.stats.mtimeMs;

        // converting to date
        itemDetails.date = new Date(itemDetails.timeStamp);
        itemDetails.date = itemDetails.date.toLocaleString();
        console.log(itemDetails.date);

        maincontent += `
        <tr data-name="${item}" data-size="${itemDetails.sizeBytes}" date-time="${itemDetails.timeStamp}">
        <td>${itemDetails.icon}<a href="${link}">${item}</a></td>
        <td> ${itemDetails.size} </td>
        <td>${itemDetails.date}</td>
        </tr>
        `
    })

    return maincontent;
}
module.exports = mainContent;