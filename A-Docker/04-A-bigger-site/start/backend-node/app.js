import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import framework from './routes/framework.js';
import vote from './routes/vote.js';

const app = express();
export default app;

// request pipeline setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/framework', framework);
app.use('/vote', vote);

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
