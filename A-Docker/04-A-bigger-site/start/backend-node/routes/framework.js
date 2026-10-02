const express = require('express');
const router = express.Router();

// Simple API key authentication middleware
// In production, use a proper identity provider or API gateway
const authenticateApiKey = (req, res, next) => {
  const apiKey = req.headers['authorization'];
  const expectedKey = process.env.API_KEY;
  
  // If no API_KEY is configured, allow requests (workshop mode)
  // In production, API_KEY should always be set
  if (!expectedKey) {
    return next();
  }
  
  if (!apiKey || apiKey !== `Bearer ${expectedKey}`) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing API key' });
  }
  
  next();
};

// Apply authentication to all routes
router.use(authenticateApiKey);

const frameworks = [
  { id: 1, name: 'React', votes: 0 },
  { id: 2, name: 'Vue', votes: 0 },
  { id: 3, name: 'Angular', votes: 0 },
  { id: 4, name: 'Ember', votes: 0 }
];

router.get('/', (req, res) => {
  res.json(frameworks);
});

router.post('/vote/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const framework = frameworks.find(f => f.id === id);
  if (framework) {
    framework.votes++;
    res.json(framework);
  } else {
    res.status(404).json({ error: 'Framework not found' });
  }
});

module.exports = router;
