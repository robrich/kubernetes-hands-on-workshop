import Router from 'express-promise-router';
import axios from 'axios';

// Assume backend ip:
const BACKEND = process.env.BACKEND || 'http://localhost:5000';
console.log(`using backend url: ${BACKEND}`);

const router = Router();
export default router;

// home page
router.get('/', async (req, res) => {
  const resp = await axios.get(BACKEND+'/framework');
  res.render('index', {frameworks:resp?.data || []});
});

// edit page
router.get('/edit/:id?', async (req, res, next) => {
  const id = req.params.id;
  if (id) {
    // edit
    const resp = await axios.get(BACKEND+'/framework/'+encodeURIComponent(id));
    if (!resp?.data) {
      const err = new Error('Not Found');
      err.status = 404;
      return next(err);
    }
    res.render('edit', resp.data);
  } else {
    // new
    res.render('edit', {});
  }
});

// save edit
router.post('/edit/:id?', async (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  if (id) {
    // edit
    await axios.put(BACKEND+'/framework/'+encodeURIComponent(id), {id, name});
    // TODO show validation failures
    res.redirect('/');
  } else {
    // new
    await axios.post(BACKEND+'/framework', {name:name});
    // TODO show validation failures
    res.redirect('/');
  }
});

router.post('/vote/up/:id', async (req, res,) => {
  const id = req.params.id;
  await axios.post(BACKEND+'/vote/'+encodeURIComponent(id));
  // TODO show validation failures
  res.redirect('/');
});
router.post('/vote/down/:id', async (req, res) => {
  const id = req.params.id;
  await axios.delete(BACKEND+'/vote/'+encodeURIComponent(id));
  // TODO show validation failures
  res.redirect('/');
});
