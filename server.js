const express = require('express');

const coffeeRouter = require('./routes/index');
const { initiateDatabase } = require('./controllers/database');

const app = express();

app.use(express.json());
app.use('/api/', coffeeRouter);

app.listen(8000, () => {
  console.log('Server started');
  initiateDatabase();
});
