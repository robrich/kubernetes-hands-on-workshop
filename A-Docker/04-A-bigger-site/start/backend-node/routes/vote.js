import Router from 'express-promise-router';
import database from '../data/database.js';

const router = Router();
export default router;

// get all frameworks
router.get('/', async (req, res) => {
  return res.json(database);
});

// upvote
router.post('/:id', async (req, res) => {
  const id = req.params.id;
  const framework = database.find(d => d.id == id);
  if (!framework) {
    return res.status(404).json({error: 'Not Found'});
  }
  if (!framework.votes) {
    framework.votes = 0;
  }
  framework.votes++;
  return res.json(framework);
});

// downvote
router.delete('/:id', async (req, res,) => {
  const id = req.params.id;
  const framework = database.find(d => d.id == id);
  if (!framework) {
    return res.status(404).json({error: 'Not Found'});
  }
  if (!framework.votes) {
    framework.votes = 0;
  }
  framework.votes--;
  return res.json(framework);
});
