const express = require('express');
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// app.use(bodyParser.json());
app.use(cors())
app.use(express.json({ limit: '10GB' }))

const rootDir = './ds/'
const folderListPath = path.join(__dirname, rootDir, 'customdata.json');
let folderList = [];

if (!fs.existsSync(rootDir)) {
  fs.mkdirSync(rootDir);
}

if (fs.existsSync(folderListPath)) {
  const folderListData = fs.readFileSync(folderListPath);
  folderList = JSON.parse(folderListData);
}

app.post('/download', (req, res) => {
  const data = req.body;
  
  if(!data) {
    res.status(400).send('No data received');
    return;
  }

  if(!data.pngBlob || !data.jsonData || !data.fileName) {
    res.status(400).send('Invalid data received');
    return;
  }

  const pngBlob = data.pngBlob;
  const jsonData = data.jsonData;

  const folderName = `m${Date.now()}`;
  const fileName = `${data.fileName}`;
  const filePath = path.join(__dirname, rootDir, folderName);

  // Create the folder if it doesn't exist
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(filePath);
    folderList.push(folderName);
    fs.writeFileSync(folderListPath, JSON.stringify(folderList));
  }

  // Save the PNG blob and JSON data
  fs.writeFileSync(path.join(filePath, `${fileName}-screenshotshot.png`), Buffer.from(pngBlob), 'base64');
  fs.writeFileSync(path.join(filePath, `${fileName}.json`), JSON.stringify(jsonData));

  console.log(`Data saved to ${folderName}`);
  res.send('Data saved successfully!');
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
