const fs = require('fs');

fs.readFile('data/customdata.json', 'utf8', (err, data) => {
    if (err) throw err;
    const jsonData = JSON.parse(data);
    console.log(jsonData.length);
});
