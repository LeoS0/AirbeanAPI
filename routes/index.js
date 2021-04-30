const { Router } = require('express');
const router = new Router();

router.get('/coffee', (req, res) => {
  console.log(req);
  res.send('Test');
});

module.exports = router;
