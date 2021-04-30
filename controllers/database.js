const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('database.json');
const database = lowdb(adapter);

function initiateDatabase() {
  database.defaults({ accounts: [] }).write();
}

exports.initiateDatabase = initiateDatabase;
