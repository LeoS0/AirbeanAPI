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
  let orderID = Math.floor(Math.random() * 100) + 1;
  let eta = Math.floor(Math.random() * 10) + 2;
  let time = moment().format('H:m');

  if (database.get('orders').find({ orderID: orderID }).value()) {
    orderID = Math.floor(Math.random() * 100) + 1;
  }

  database.get('orders').push({ orderID: orderID, menuID: order.menuID, userID: order.userID, eta: eta, time: time }).write();

  return `Order Added. ID: ${orderID} ETA: ${eta} min`;
}

function getOrder(ID) {
  const userID = parseInt(ID);
  const orderHistory = database.get('orders').filter({ userID: userID }).value();

  let timeNow = moment().format('H:m');
  let timeBefore = parseInt(database.get('orders').filter({ userID: userID }).map('time').value());

  console.log(timeBefore);
  console.log('Time:', timeNow);

  return orderHistory;
}

exports.initiateDatabase = initiateDatabase;
exports.addAccount = addAccount;
exports.addOrder = addOrder;
exports.getOrder = getOrder;
