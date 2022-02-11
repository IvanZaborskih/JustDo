require('dotenv').config();
const express = require("express");
const db = require("./db");
const models = require('./models/models');
const cors = require('cors');
const router = require('./routers/index');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: '*'
}));
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api', router);

db.sync()
    .then(() => console.log('Database connected'))
    .catch(err => console.log('Error ' + err));
app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
});