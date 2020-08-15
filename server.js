const express  = require('express');
const app = express();
const {} = require('./db/db.json');



app.listen(3001, () => {
    console.log(`API server now on port 3001!`);
})