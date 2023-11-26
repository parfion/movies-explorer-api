const { ValidationError, CastError } = require('mongoose').Error;
const MovieModel = require('../models/movie');

const NoRightsError = require('../errors/NoRightsError');
const PageNotFoundError = require('../errors/PageNotFoundError');
const BadRequestError = require('../errors/BadRequestError');

const { STATUS_OK, STATUS_CREATED } = require('../constants');

const getMovies = (req, res, next) => {
  const owner = req.user._id;
  MovieModel.find({ owner })
    .then((movies) => res.status(STATUS_OK).send(movies))
    .catch((err) => next(err));
};

const createMovie = (req, res, next) => {
  const ownerId = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  MovieModel.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: ownerId,
  })
    .then((movie) => res.status(STATUS_CREATED).send(movie))
    .catch((err) => {
      if (err instanceof ValidationError) {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

const deleteMovie = (req, res, next) => {
  const _id = req.params;
  MovieModel.findById(_id)
    .then((deletedMovie) => {
      if (!deletedMovie) {
        return next(new PageNotFoundError('Запрашиваемый фильм отсутствует'));
      }
      if (String(deletedMovie.owner) !== req.user._id) {
        return next(new NoRightsError('Нет прав для удаления фильма другого пользователя'));
      }
      return MovieModel.deleteOne(deletedMovie._id)
        .then(() => res.status(STATUS_OK).send({ message: 'Фильм удален' }));
    })
    .catch(((err) => {
      if (err instanceof CastError) {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(err);
    }));
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
