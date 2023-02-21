import Router from 'express-promise-router';
import database from '../data/database.js';

const router = Router();
export default router;

// get all frameworks
router.get('/', async (req, res) => {
  return res.json(database);
});

// get framework by id
router.get('/:id?', async (req, res) => {
  const id = req.params.id;
  const framework = database.find(f => f.id == id);
  if (!framework) {
    return res.status(404).json({error: 'Not Found'});
  }
  return res.json(framework);
});

// add new
router.post('/', async (req, res) => {
  const id = database.length + 1;
  const framework = req.body;
  framework.id = id;
  framework.votes = 0;
  framework.name = (framework.name ?? 'undefined').trim();
  database.push(framework);
  return res.json(framework);
});

// edit
router.put('/:id', async (req, res,) => {
  const id = req.params.id;
  const framework = req.body;
  framework.id = id;
  framework.votes = framework.votes || 0;
  const index = database.findIndex(d => d.id == id);
  if (index < 0) {
    return res.status(404).json({error: 'Not Found'});
  }
  database[index] = framework;
  return res.json(framework);
});

router.delete('/:id', async (req, res) => {
  const index = database.findIndex(d => d.id == id);
  if (index < 0) {
    return res.status(404).json({error: 'Not Found'});
  }
  database[index] = framework;
  return res.json(database);
});
