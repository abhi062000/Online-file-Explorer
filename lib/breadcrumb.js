let path = require('path');

const buildBreadcrumb = pathname => {
    let pathChunks = pathname.split('/').filter(element => element !== '');
    console.log(`pathchunks ${pathChunks}`);

    let breadcrumb = `<li class="breadcrumb-item"><a href="/">Home</a></li>`;

    let link = "/";
    pathChunks.forEach((item, index) => {
        link = path.join(link, item);
        console.log(link);
        if (index !== pathChunks.length - 1) {
            breadcrumb += `<li class="breadcrumb-item"><a href="${link}">${item}</a></li>`
        } else {
            breadcrumb += `<li class="breadcrumb-item active" aria-current="page">${item}</li>`
        }

    })
    return breadcrumb;

};
module.exports = buildBreadcrumb;