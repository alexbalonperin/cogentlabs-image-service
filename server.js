process.title = 'image-service';

const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');

const HOST = process.env.SERVICE_HOST || 'localhost';
const PORT = process.env.SERVICE_PORT || 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Image service');
});

app.get('/images/:id', (req, res) => {
  res.send('Image not ready');
});

app.post('/images', (req, res) => {
  var hrTime = process.hrtime();
  var id = hrTime[0] * 1000000 + hrTime[1] / 1000;
  var stream = fs.createWriteStream('/tmp/uploads/upload-' + id + '.jpg');
  req
    .on('data', chunk => {
      stream.write(chunk);
    })
    .on('end', () => {
      stream.end();
      console.log('DONE');
      res.send('DONE');
    });
});

console.log(`Image service run on ${HOST}:${PORT}`);

app.listen(PORT, HOST);
