const express = require('express');
require('dotenv').config()
const dbConnect = require('../server/config/dbconnect')
const initRoutes = require('../server/routes/index')

const app = express();
const port = process.env.PORT || 5555;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dbConnect();
initRoutes(app);

app.listen(port, ()=> {
    console.log(`Server running on port ${port}`);
})
