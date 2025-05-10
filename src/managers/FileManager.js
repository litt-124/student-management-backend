'use strict';

const path = require('path');
const fs = require('fs');
const MANAGER = require(path.join(process.cwd(), 'MANAGER')).getInstance();
const AbstractManager = require(path.join(MANAGER.getManagersDir(), 'AbstractManager'));

class FileManager extends AbstractManager {

}

module.exports = new FileManager();
