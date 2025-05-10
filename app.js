'use strict';

require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const MANAGER = require(path.join(process.cwd(), 'MANAGER')).getInstance(app);

app.listen(port, async () => {
    console.log(`Server is running on ${process.env.HOST}:${port}`);
    MANAGER.initialize();
});


