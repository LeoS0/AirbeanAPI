const express = require('express');
const cors = require('cors');

const coffeeRouter = require('./routes/index');
const { initiateDatabase } = require('./controllers/database');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/', coffeeRouter);

app.listen(8000, () => {
  console.log('Server started');
  initiateDatabase();
});
