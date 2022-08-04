const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let currentStr, replaceStr;

const replaceFilesRecursively = async (folderName) => {
    fs.readdir(folderName, { withFileTypes: true }, (err, files) => {
        if (err) throw err;

        files.forEach((filename) => {
            if (filename.isDirectory()) {
                if (filename.name == 'images') {
                    return
                } else {
                    replaceFilesRecursively(`${folderName}/${filename.name}`)
                }
                return
            } else {
                fs.readFile(`${folderName}/${filename.name}`, 'utf8', function (err, data) {
                    if (err) throw err;

                    var re = new RegExp(currentStr, "g");
                    var result = data.replace(re, replaceStr);

                    fs.writeFile(`${folderName}/${filename.name}`, result, 'utf8', function (err) {
                        if (err) return console.log(err);
                    });

                });
            }
        });
    });
}

const replaceFoldersRecursively = async (folderName) => {
    fs.readdir(folderName, { withFileTypes: true }, (err, folders) => {
        if (err) throw err;

        folders.forEach((filename) => {
            if (filename.isDirectory()) {
                if (filename.name == currentStr) {
                    fs.rename(`./${currentStr}/images/${currentStr}`, `./${currentStr}/images/${replaceStr}`, function (err) {
                        if (err) throw err;
                    })
                } else {
                    replaceFoldersRecursively(`${folderName}/${filename.name}`)
                }
            }
        })
    })
}

rl.question('What is current name of merchant folder ? ', function (current) {
    rl.question('What should be ? ', function (future) {
        currentStr = current;
        replaceStr = future;
        rl.close();
    });
});

rl.on('close', async () => {
    try {
        const replaceFiles = await replaceFilesRecursively(currentStr)
        const replaceFolders = await replaceFoldersRecursively(currentStr)
        console.log('Job is done finally')
    } catch {
        console.error('Job not done :(')
    }
})