const { Router } = require('express');
const router = new Router();

const menu = require('../menu.json');
const { addAccount, addOrder, getOrder } = require('../controllers/database');

router.get('/coffee', (req, res) => {
  res.send(menu);
});

router.post('/account', (req, res) => {
  res.json(addAccount(req.body));
});

router.post('/order', (req, res) => {
  res.json(addOrder(req.body));
});

router.get('/order/:id', (req, res) => {
  res.json(getOrder(req.params.id));
});

module.exports = router;
