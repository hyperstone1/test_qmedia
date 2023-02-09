require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
// const sequelize = require('./db');
const cors = require('cors');
const router = require('./router/index');
// const errorHandler = require('./middleware/errorHandlingMiddleware');

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', router);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(errorHandler);

const start = async () => {
  try {
    app.listen(PORT, () => console.log(`Server starting on port ${PORT}`));
  } catch (error) {
    console.log('Error with starting server: ', error);
  }
};
start();
