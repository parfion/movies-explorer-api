/* eslint-disable no-useless-escape */

const { celebrate, Joi } = require('celebrate');

const URL = /https?\:\/\/[a-zA-Z0-9]+\.[a-z]*[\/a-zA-z0-9]*\S*/;

module.exports = {
  loginValidation: celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  createUserValidation: celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  updateUserInfoValidation: celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().email(),
    }),
  }),
  createMovieValidation: celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string().required().regex(URL),
      trailerLink: Joi.string().required().regex(URL),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
      thumbnail: Joi.string().required().regex(URL),
      movieId: Joi.number().required(),
    }),
  }),
  deleteMovieValidation: celebrate({
    params: Joi.object().keys({
      _id: Joi.string().length(24).hex().required(),
    }),
  }),
};
