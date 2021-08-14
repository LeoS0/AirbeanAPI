//database
const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('database.json');
const database = lowdb(adapter);

//dependencies
const moment = require('moment');

//initierar databasen
function initiateDatabase() {
  database.defaults({ accounts: [], orders: [] }).write();
}

// Skapar konto och verifierar username och password
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

function SignIn(body) {
  const account = body;
  console.log('Account Info:', account);

  const usernameExists = database.get('accounts').find({ username: account.username }).value();
  const passwordExists = database.get('accounts').find({ password: account.password }).value();

  let result = false;

  if (usernameExists && passwordExists) {
    result = usernameExists;
  } else {
    result = false;
  }

  return result;
}

//Lägger till ordrar, order ID är satt från 1 - 100 och ETA är satt till 1-10. Ordrar tar alltså max 10 min
function addOrder(body) {
  const order = body;
  console.log(body);
  let orderID = Math.floor(Math.random() * 100) + 1;
  let historyID = Math.floor(Math.random() * 100000) + 1;
  let historyDate = moment().format('YYYY-MM-DD');
  let eta = Math.floor(Math.random() * 10) + 2;

  let startHour = parseInt(moment().format('H'));
  let startMinute = parseInt(moment().format('m'));

  if (database.get('orders').find({ orderID: orderID }).value()) {
    orderID = Math.floor(Math.random() * 100) + 1;
  }

  database
    .get('orders')
    .push({
      orderID: orderID,
      menuID: order.menuID,
      userID: order.userID,
      eta: eta,
      startHour: startHour,
      startMinute: startMinute,
      status: 'Pågående Beställning',
    })
    .write();

  if (order.userID !== undefined) {
    database
      .get('history')
      .push({
        userID: order.userID,
        historyID: historyID,
        historyDate: historyDate,
        history: order.userHistory,
      })
      .write();
  }

  return { ID: orderID, time: eta };
}

function getHistory(ID) {
  const userID = parseInt(ID);
  const userHistory = database.get('history').filter({ userID: userID }).value();

  return userHistory;
}

// Hämtar ordrar
function getOrder(ID) {
  const userID = parseInt(ID);
  const orderHistory = database.get('orders').filter({ userID: userID }).value();

  let timeNowHour = parseInt(moment().format('H'));
  let timeNowMinute = parseInt(moment().format('m'));
  let timeBeforeHour = database.get('orders').filter({ userID: userID }).map('startHour').value();
  let timeBeforeMinute = database.get('orders').filter({ userID: userID }).map('startMinute').value();
  let eta = database.get('orders').filter({ userID: userID }).map('eta').value();

  let timeDifferenceHour;
  let timeDifferenceMinute;

  for (let i = 0; i < timeBeforeHour.length; i++) {
    timeDifferenceHour = timeNowHour - timeBeforeHour[i];
    timeDifferenceMinute = timeNowMinute - timeBeforeMinute[i];
    if (timeDifferenceMinute > eta[i] && timeDifferenceHour === 0) {
      database.get('orders').find({ status: 'Pågående Beställning' }).assign({ status: 'Tidigare Beställning' }).write();
    } else {
      database.get('orders').find({ status: 'Pågående Beställning' }).assign({ status: 'Pågående Beställning' }).write();
    }
  }

  return orderHistory;
}

//Exporterar våra funktioner
exports.initiateDatabase = initiateDatabase;
exports.addAccount = addAccount;
exports.addOrder = addOrder;
exports.getOrder = getOrder;
exports.getHistory = getHistory;
exports.SignIn = SignIn;
