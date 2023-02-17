import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import { dirname,join } from 'path';
import { fileURLToPath } from 'url';
import index from './routes/index.js';

const app = express();
export default app;

// view engine setup
const __dirname = dirname(fileURLToPath(import.meta.url));
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'hbs');

// request pipeline setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(join(__dirname, 'public')));
app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log('Error: '+new Date().toISOString());
  console.error(err);

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
