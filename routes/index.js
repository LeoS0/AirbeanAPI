const { Router } = require('express');
const router = new Router();

const menu = require('../menu.json');
const { addAccount, addOrder } = require('../controllers/database');

router.get('/coffee', (req, res) => {
  res.send(menu);
});

router.post('/account', (req, res) => {
  res.json(addAccount(req.body));
});

router.post('/order', (req, res) => {
  res.json(addOrder(req.body));
});

module.exports = router;
