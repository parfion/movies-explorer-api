const bcrypt = require('bcrypt');
const { ValidationError, CastError } = require('mongoose').Error;
const UserModel = require('../models/user');
const getJwtToken = require('../utils/auth');
const UnAuthorizedError = require('../errors/UnAuthorizedError');
const PageNotFoundError = require('../errors/PageNotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const DublicateError = require('../errors/DublicateError');

const { STATUS_OK, STATUS_CREATED } = require('../constants');

const SALT_ROUNDS = 10;

const getUser = (req, res, next) => {
  const id = req.user._id;
  UserModel.findById(id)
    .then((user) => {
      if (!user) {
        return next(new PageNotFoundError('Запрашиваемый пользователь не найден'));
      }
      return res.status(STATUS_OK).send({
        name: user.name,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err instanceof CastError) {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

const updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  UserModel.findByIdAndUpdate(req.user._id, { name, email }, { runValidators: true, new: true })
    .then((data) => res.status(STATUS_OK).send(data))
    .catch((err) => {
      if (err instanceof ValidationError) {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  return bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => UserModel.create({ name, email, password: hash }))
    .then((user) => res.status(STATUS_CREATED).send({
      name: user.name,
      email: user.email,
      id: user._id,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new DublicateError('Такой пользователь уже существует'));
      }
      if (err instanceof ValidationError) {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  UserModel.findOne({ email }).select('+password')
    .then((admin) => {
      if (!admin) {
        return next(new UnAuthorizedError('Такого пользователя не существует'));
      }
      return bcrypt.compare(password, admin.password)
        .then((matched) => {
          if (!matched) {
            return next(new UnAuthorizedError('Пароль не верный'));
          }
          const token = getJwtToken({ _id: admin._id });
          return res.status(STATUS_OK).send({ token });
        });
    })
    .catch((err) => next(err));
};

module.exports = {
  getUser,
  updateUserInfo,
  createUser,
  login,
};
