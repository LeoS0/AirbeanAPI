const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('database.json');
const database = lowdb(adapter);

const moment = require('moment');

function initiateDatabase() {
  database.defaults({ accounts: [], orders: [] }).write();
}

function addAccount(body) {
  const account = body;
  console.log('Account Info:', account);

  const usernameExists = database.get('accounts').find({ username: account.username }).value();
  const passwordExists = database.get('accounts').find({ password: account.password }).value();

  let result = false;

  if (!usernameExists && !passwordExists) {
    database.get('accounts').push(account).write();
    result = true;
  }

  return result;
}

function addOrder(body) {
  const order = body;
  const orderID = 1;
  const eta = Math.floor(Math.random() * 10);

  database.get('orders').push({ orderID: orderID, menuID: order.menuID, userID: order.userID, eta: eta }).write();

  return 'Done';
}

/*
{
  accounts: 
  [
    {
      userID: 1
      username: test
      password: test,
      orderID: 1923
    }
  ],
  orders: [
    {
      orderID: 1923,
      menuID: 2,
      userID: 1,
      eta: 3
    }
  ]
}
*/

exports.initiateDatabase = initiateDatabase;
exports.addAccount = addAccount;
exports.addOrder = addOrder;
