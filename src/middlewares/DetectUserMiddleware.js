'use strict';

const path = require("path");
const MANAGER = require(path.join(process.cwd(), 'MANAGER')).getInstance();
const UserManager = require(path.join(MANAGER.getManagersDir(), 'UserManager'));
const mongoose = require("mongoose");
const UserSession = mongoose.model("UserSession");

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
        const token = req.headers['authorization'];
        if (!token) {
            req.currentUser = null;
            return next();
        }

        const user = await UserManager.getByToken(token);
        if (!user) {
            req.currentUser = null;
            return next();
        }

        const session = await UserSession.findOne({
            userId: user._id,
            token: token,
            endTime: null
        });

        if (!session) {
            req.currentUser = null;
            return res.status(403).json({ message: 'Session invalid or expired' });
        }

        req.currentUser = user;
        return next();
    }
}

module.exports = new DetectUserMiddleware();
