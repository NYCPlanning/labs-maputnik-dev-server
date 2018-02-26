const express = require('express');

const router = express.Router();

let style = {};

router.post('/style', (req, res) => {
  style = req.body;
  style.id = 'develop';
  style.metadata = {
    'maputnik:mapbox_access_token': process.env.MAPBOX_ACCESS_TOKEN,
  };
  res.json({ status: 'success' });
  console.log('POST')
});

router.get('/style', (req, res) => {
  res.json(style);
  console.log('GET')
});

module.exports = router;
