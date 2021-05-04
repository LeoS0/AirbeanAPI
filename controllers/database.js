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
//Lägger till ordrar
function addOrder(body) {
  const order = body;
  let orderID = Math.floor(Math.random() * 100) + 1;
  let eta = Math.floor(Math.random() * 10) + 2;
  //let time = moment().format('H:m');
  let startHour = parseInt(moment().format('H'));
  let startMinute = parseInt(moment().format('m'));

  if (database.get('orders').find({ orderID: orderID }).value()) {
    orderID = Math.floor(Math.random() * 100) + 1;
  }

  database.get('orders').push({ orderID: orderID, menuID: order.menuID, userID: order.userID, eta: eta, startHour: startHour, startMinute:startMinute }).write();

  return `Order Added. ID: ${orderID} ETA: ${eta} min`;
}

function getOrder(ID) {
  const userID = parseInt(ID);
  const orderHistory = database.get('orders').filter({ userID: userID }).value();

  let timeNowHour = parseInt(moment().format('H'));
  let timeNowMinute = parseInt (moment().format('m'));
  let timeBeforeHour = parseInt(database.get('orders').filter({ userID: userID }).map('startHour').value());
  let timeBeforeMinute = parseInt(database.get('orders').filter({ userID: userID }).map('startMinute').value());
  
  //console.log('Time:', timeNow);
  //console.log(timeBefore);

  //timeNowHour.subtrack(timeBeforeHour - startHour);
  //timeNowMinute.subtrack(timeBeforeMinute - startMinute);
 
  console.log(timeBeforeHour);
  //console.log(timeNowHour);
  //console.log(`After manipulation:',${timeNow.toString()}`)

  return orderHistory;
}

exports.initiateDatabase = initiateDatabase;
exports.addAccount = addAccount;
exports.addOrder = addOrder;
exports.getOrder = getOrder;
