let calculateSizeF = stats => {

    let filesizeBytes = stats.size; //bytes
    const units = "BKMGT";

    let index = Math.floor(Math.log10(filesizeBytes) / 3);
    let filesizeHuman = (filesizeBytes / Math.pow(1000, index)).toFixed(1);
    const unit = units[index];

    let filesize = `${filesizeHuman}${unit}`

    return [filesize, filesizeBytes];

}
module.exports = calculateSizeF;