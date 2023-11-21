const express = require('express');
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb', {
  'useNewUrlParser': true
  })
  .then(() => console.log('Connected to MongoDB'));
const app = express();

const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => res.status(200).send('Express'));

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));