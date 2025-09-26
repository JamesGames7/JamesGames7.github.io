const fs = require('node:fs');

fs.readFile('adventures/firstAdventure.json', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(data);
}) 