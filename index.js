const fs = require('fs');


(async (outputFile) => {

    const loadImage = (filename) =>
          new Promise((res,rej) =>
                      fs.readFile(filename,
                                  (err, data) =>
                                  err ? rej(err) : res(data)));

    const getFilenames = (dirname) =>
          new Promise((res,rej) =>
                      fs.readdir(dirname,
                                 (err,files) =>
                                 err ? rej(err) : res(files)));

    // array of buffers
    const loadedImages = await getFilenames('./all/')
          .then((files) =>
                Promise.allSettled(files.map(file =>
                                             loadImage('./all/' + file))));
    
    const encodedImages = loadedImages.map(buf => buf.value.toString('base64'));

    const dataURLs = encodedImages.map(img => `data:image/bmp;base64,${img}`);
    
    const output = {};
    dataURLs.forEach((durl, i) => output[i] = durl);

    fs.writeFileSync(outputFile, JSON.stringify(output));
    
})(`encoded_patterns_${Date.now()}.json`);

