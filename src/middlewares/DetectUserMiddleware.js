'use strict';

const path = require("path");
const MANAGER = require(path.join(process.cwd(), 'MANAGER')).getInstance();
const UserManager = require(path.join(MANAGER.getManagersDir(), 'UserManager'));

class DetectUserMiddleware {

    constructor() {
        this.MANAGER = MANAGER;
    }

    /**
     * set current user in request
     *
     * @param req
     * @param res
     * @param next
     *
     * @returns {Promise<*>}
     */
    async detect(req, res, next) {
        if(!req.headers['authorization']) {
            req.currentUser = null;
        }
        else {
            req.currentUser = await UserManager.getByToken(req.headers['authorization']);
        }

        return next();
    }
}

module.exports = new DetectUserMiddleware();