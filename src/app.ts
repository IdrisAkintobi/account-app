import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import balance from './routes/balance';
import transfer from './routes/transfer';
import create from './routes/create-account';
import { Env } from '@humanwhocodes/env';
import { readFile, writeFile } from 'fs';

const env = new Env();
const app = express();

// view engine setup
app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'public')));

//Creating database when app starts... Create different database for test
if (process.env.NODE_ENV === 'test') {
  require('dotenv').config({ path: './env.test' });
} else require('dotenv').config();
export const dbPath = env.require('DBPATH');
readFile(dbPath, (err, data) => {
  if (err) {
    writeFile(dbPath, JSON.stringify([]), (err) => {});
  }
});

//App routes
app.use('/balance', balance);
app.use('/transfer', transfer);
app.use('/create', create);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (
  err: createError.HttpError,
  req: express.Request,
  res: express.Response,
  _next: express.NextFunction,
) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
