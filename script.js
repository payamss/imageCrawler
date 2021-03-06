const cherio = require('cherio');
const request = require('request');
const fs = require('fs');
const axios = require('axios');
const process = require('process');

// Printing process.argv property value
//console.log(process.argv);
(async () => {
    console.log(process.argv[2]);
    var label = process.argv[2];
    await request(`https://www.google.com/search?q=${label} movie&source=lnms&tbm=isch`, (err, res, html) => {
        if (!err && res.statusCode === 200) {
            console.log("request Success");
            const $ = cherio.load(html);
            var i = 0;
            $("img").each(async (index, image) => {
                if (i < 1) { //get First correct URL
                    var imgLinks = $(image).attr('src');
                    if (imgLinks.includes("https://")) {
                        const dir = `./Data/${label}`;
                        i++;
                        await fs.promises.mkdir(dir, { recursive: true });
                        await download_image(imgLinks, label);

                    }
                }
            })
        } else {
            console.log("request Failed");
            console.log(err);

        }
    });
})();

const download_image = (url, label) =>
    axios({
        url,
        responseType: 'stream',
    }).then(
        response =>
            new Promise((resolve, reject) => {
                response.data
                    .pipe(fs.createWriteStream(`./Data/${label}/1.jpg`))
                    .on('finish', () => resolve())
                    .on('error', e => reject(e));
            }),
    );