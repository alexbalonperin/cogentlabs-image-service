process.title = 'image-service';

const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const Rabbit = require('./src/rabbit');
const RabbitMQMessage = require('./src/message');

const Redis = require('./src/redis');

const redis = new Redis();

const dstPath = '/tmp/uploads/';

const rabbit = new Rabbit();
rabbit.start();

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
  var hrTime = process.hrtime.bigint();
  var id = hrTime;
  redis.setNew(id);
  var imagePath = dstPath + 'upload-' + id;
  var stream = fs.createWriteStream(imagePath);
  req
    .on('data', chunk => {
      stream.write(chunk);
    })
    .on('end', () => {
      stream.end();
      var msg = new RabbitMQMessage('' + id, imagePath);
      rabbit.publish(msg);
      redis.setPublished(id);
      res.send(JSON.stringify({ id: id.toString() }));
    });
});

console.log(`Image service run on ${HOST}:${PORT}`);

app.listen(PORT, HOST);
