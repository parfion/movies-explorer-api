const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    validate: {
      validator: (link) => validator.isURL(link),
      message: (props) => `${props.value} неверный формат ссылки`,
    },
    required: true,
  },
  trailerLink: {
    type: String,
    validate: {
      validator: (link) => validator.isURL(link),
      message: (props) => `${props.value} неверный формат ссылки`,
    },
    required: true,
  },
  thumbnail: {
    type: String,
    validate: {
      validator: (link) => validator.isURL(link),
      message: (props) => `${props.value} неверный формат ссылки`,
    },
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
